from django.contrib import admin

# Register your models here.
# eco_score/admin.py
from django.contrib import admin
from .models import EcoLog

admin.site.register(EcoLog)