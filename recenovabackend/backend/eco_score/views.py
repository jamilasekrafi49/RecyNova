
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import EcoLog
from projects.models import Project


class EcoLogListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    # Consulter l'historique écologique
    def get(self, request):
        logs = EcoLog.objects.filter(
            user=request.user
        ).select_related('project').order_by('-date')

        data = []

        for log in logs:
            data.append({
                "id": log.id,
                "project_id": log.project.id,
                "project_titre": log.project.titre,
                "kg_reutilises": log.kg_reutilises,
                "date": log.date
            })

        return Response(data, status=status.HTTP_200_OK)

    # Enregistrer un projet terminé
    @transaction.atomic
    def post(self, request):
        project_id = request.data.get('project_id')
        kg_reutilises = request.data.get('kg_reutilises')

        if not project_id or kg_reutilises is None:
            return Response(
                {"error": "project_id et kg_reutilises sont obligatoires."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            kg_reutilises = float(kg_reutilises)

            if not (0 < kg_reutilises < float('inf')):
                raise ValueError()

        except (ValueError, TypeError):
            return Response(
                {"error": "La quantité doit être un nombre positif valide."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response(
                {"error": "Projet introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Créer l'historique
        eco_log = EcoLog.objects.create(
            user=request.user,
            project=project,
            kg_reutilises=kg_reutilises
        )

        # Mettre à jour le score écologique
        request.user.eco_score_total += kg_reutilises
        request.user.save(update_fields=['eco_score_total'])

        return Response({
            "message": "Projet terminé avec succès !",
            "eco_log": {
                "id": eco_log.id,
                "project_id": project.id,
                "project_titre": project.titre,
                "kg_reutilises": eco_log.kg_reutilises,
                "date": eco_log.date
            },
            "eco_score_total": request.user.eco_score_total
        }, status=status.HTTP_201_CREATED)
