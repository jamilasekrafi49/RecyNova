from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from .models import Material


class MaterialListView(APIView):
    permission_classes = [AllowAny]

    # Afficher tous les matériaux
    def get(self, request):
        materials = Material.objects.all().order_by('nom')

        data = []

        for material in materials:
            data.append({
                "id": material.id,
                "nom": material.nom,
                "poids_moyen_kg": material.poids_moyen_kg
            })

        return Response(data, status=status.HTTP_200_OK)


class MaterialDetailView(APIView):
    permission_classes = [AllowAny]

    # Afficher un matériau par son ID
    def get(self, request, pk):
        try:
            material = Material.objects.get(id=pk)

        except Material.DoesNotExist:
            return Response(
                {"error": "Matériau introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "id": material.id,
            "nom": material.nom,
            "poids_moyen_kg": material.poids_moyen_kg
        }, status=status.HTTP_200_OK)