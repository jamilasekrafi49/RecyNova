from django.db import models

# Create your models here.
from django.conf import settings
from django.db import models


class EcoLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    project = models.ForeignKey("projects.Project", on_delete=models.CASCADE)
    kg_reutilises = models.FloatField(default=0)
    date = models.DateField(auto_now_add=True)