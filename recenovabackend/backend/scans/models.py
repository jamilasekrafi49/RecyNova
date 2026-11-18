from django.db import models

# Create your models here.
from django.conf import settings
from django.db import models


class Scan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="scans/", null=True, blank=True)
    budget = models.PositiveIntegerField(default=0)
    temps_dispo = models.PositiveIntegerField()
    difficulte = models.CharField(max_length=10)
    ai_raw_response = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)


class ScanMaterial(models.Model):
    scan = models.ForeignKey(Scan, on_delete=models.CASCADE)
    material = models.ForeignKey("materials.Material", on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("scan", "material")


class ScanProject(models.Model):
    scan = models.ForeignKey(Scan, on_delete=models.CASCADE)
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE)
    rang = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ("scan", "rang")