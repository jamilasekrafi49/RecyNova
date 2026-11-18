from django.db import models

# Create your models here.
from django.db import models


class Material(models.Model):
    nom = models.CharField(max_length=50, unique=True)
    poids_moyen_kg = models.FloatField(default=0.05)

    def __str__(self):
        return self.nom