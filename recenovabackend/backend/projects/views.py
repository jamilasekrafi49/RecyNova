
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from .models import Project


def project_to_dict(project):
    return {
        "id": project.id,
        "titre": project.titre,
        "description": project.description,
        "cout_estime": project.cout_estime,
        "duree_minutes": project.duree_minutes,
        "difficulte": project.difficulte,
        "etapes": project.etapes,
        "image": project.image.url if project.image else None,

        "materiaux": [
            {
                "id": material.id,
                "nom": material.nom,
                "poids_moyen_kg": material.poids_moyen_kg
            }
            for material in project.materiaux.all()
        ]
    }


# 1. Liste des projets avec filtres
class ProjectListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        projects = Project.objects.prefetch_related(
            'materiaux'
        ).all()

        difficulte = request.query_params.get('difficulte')
        budget = request.query_params.get('budget')
        temps = request.query_params.get('temps')
        material_id = request.query_params.get('material_id')

        if difficulte:
            projects = projects.filter(difficulte=difficulte)

        if budget:
            projects = projects.filter(cout_estime__lte=budget)

        if temps:
            projects = projects.filter(duree_minutes__lte=temps)

        if material_id:
            projects = projects.filter(
                materiaux__id=material_id
            )

        projects = projects.distinct().order_by('cout_estime')

        data = [
            project_to_dict(project)
            for project in projects
        ]

        return Response(data, status=status.HTTP_200_OK)


# 2. Détails d'un projet
class ProjectDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            project = Project.objects.prefetch_related(
                'materiaux'
            ).get(pk=pk)

        except Project.DoesNotExist:
            return Response(
                {"error": "Projet introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            project_to_dict(project),
            status=status.HTTP_200_OK
        )
