from django.db import models

# Create your models here.
from django.db import models


class Project(models.Model):
    titre = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    cout_estime = models.DecimalField(max_digits=6, decimal_places=2)
    duree_minutes = models.PositiveIntegerField()
    difficulte = models.CharField(max_length=10)  # facile / moyen / difficile
    etapes = models.JSONField(default=list)
    image = models.ImageField(upload_to="projects/", null=True, blank=True)
    materiaux = models.ManyToManyField("materials.Material")

    def __str__(self):
        return self.titre