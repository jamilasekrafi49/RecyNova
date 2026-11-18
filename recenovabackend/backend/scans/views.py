
import json

from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Scan, ScanMaterial, ScanProject
from materials.models import Material
from projects.models import Project


def project_to_dict(project):
    return {
        "id": project.id,
        "titre": project.titre,
        "description": project.description,
        "cout_estime": project.cout_estime,
        "duree_minutes": project.duree_minutes,
        "difficulte": project.difficulte,
        "etapes": project.etapes,
        "image": project.image.url if project.image else None
    }


class ScanListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    # 1. Consulter l'historique des scans
    def get(self, request):

        scans = Scan.objects.filter(
            user=request.user
        ).order_by('-created_at')

        data = []

        for scan in scans:

            materials = []

            for item in ScanMaterial.objects.filter(
                scan=scan
            ).select_related('material'):

                materials.append({
                    "id": item.material.id,
                    "nom": item.material.nom,
                    "quantite": item.quantite,
                    "poids_moyen_kg": item.material.poids_moyen_kg
                })

            recommendations = []

            for item in ScanProject.objects.filter(
                scan=scan
            ).select_related('project').order_by('rang'):

                recommendations.append({
                    "rang": item.rang,
                    "project": project_to_dict(item.project)
                })

            data.append({
                "id": scan.id,
                "image": scan.image.url if scan.image else None,
                "budget": scan.budget,
                "temps_dispo": scan.temps_dispo,
                "difficulte": scan.difficulte,
                "ai_raw_response": scan.ai_raw_response,
                "created_at": scan.created_at,
                "materiaux": materials,
                "recommendations": recommendations
            })

        return Response(data, status=status.HTTP_200_OK)

    # 2. Créer un nouveau scan
    @transaction.atomic
    def post(self, request):

        budget = request.data.get('budget', 0)
        temps_dispo = request.data.get('temps_dispo')
        difficulte = request.data.get('difficulte')

        # Vérification des champs obligatoires
        if temps_dispo is None or not difficulte:

            return Response(
                {
                    "error": "Le temps disponible et la difficulté sont obligatoires."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérification des valeurs numériques
        try:
            budget = int(budget)
            temps_dispo = int(temps_dispo)

            if budget < 0 or temps_dispo <= 0:
                raise ValueError()

        except (ValueError, TypeError):

            return Response(
                {"error": "Budget ou temps disponible invalide."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérification de la difficulté
        if difficulte not in ['facile', 'moyen', 'difficile']:

            return Response(
                {"error": "La difficulté doit être facile, moyen ou difficile."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Récupération des matériaux manuels
        materiaux = request.data.get('materiaux', [])

        if isinstance(materiaux, str):
            try:
                materiaux = json.loads(materiaux)
            except json.JSONDecodeError:
                return Response(
                    {"error": "Format des matériaux invalide."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if not isinstance(materiaux, list):
            return Response(
                {"error": "Les matériaux doivent être une liste."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier les matériaux avant de créer le scan
        validated_materials = []

        for item in materiaux:

            if not isinstance(item, dict):
                return Response(
                    {"error": "Format d'un matériau invalide."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            material_id = item.get('material_id')
            quantite = item.get('quantite', 1)

            try:
                quantite = int(quantite)
                if quantite <= 0:
                    raise ValueError()

                material = Material.objects.get(id=material_id)

            except (ValueError, TypeError, Material.DoesNotExist):
                return Response(
                    {"error": "Matériau ou quantité invalide."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            validated_materials.append((material, quantite))

        # Création du scan
        scan = Scan.objects.create(
            user=request.user,
            image=request.FILES.get('image'),
            budget=budget,
            temps_dispo=temps_dispo,
            difficulte=difficulte
        )

        # Enregistrement des matériaux
        for material, quantite in validated_materials:

            ScanMaterial.objects.create(
                scan=scan,
                material=material,
                quantite=quantite
            )

        # Recherche des projets compatibles
        projects = Project.objects.filter(
            cout_estime__lte=budget,
            duree_minutes__lte=temps_dispo,
            difficulte=difficulte
        ).order_by('cout_estime', 'duree_minutes')

        selected_projects = list(projects[:3])

        # Compléter avec des projets proches si nécessaire
        if len(selected_projects) < 3:

            existing_ids = [
                project.id for project in selected_projects
            ]

            additional_projects = Project.objects.exclude(
                id__in=existing_ids
            ).filter(
                cout_estime__lte=budget,
                duree_minutes__lte=temps_dispo
            ).order_by('cout_estime', 'duree_minutes')

            for project in additional_projects:

                if len(selected_projects) >= 3:
                    break

                selected_projects.append(project)

        # Enregistrement des recommandations
        recommendations = []

        for rang, project in enumerate(selected_projects, start=1):

            ScanProject.objects.create(
                scan=scan,
                project=project,
                rang=rang
            )

            recommendations.append({
                "rang": rang,
                "project": project_to_dict(project)
            })

        return Response(
            {
                "message": "Scan enregistré avec succès.",
                "scan_id": scan.id,
                "materiaux": [
                    {
                        "id": material.id,
                        "nom": material.nom,
                        "quantite": quantite
                    }
                    for material, quantite in validated_materials
                ],
                "recommendations": recommendations
            },
            status=status.HTTP_201_CREATED
        )
