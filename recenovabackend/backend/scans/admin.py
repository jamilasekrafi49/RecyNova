from django.contrib import admin

# Register your models here.
# scans/admin.py
from django.contrib import admin
from .models import Scan, ScanMaterial, ScanProject

admin.site.register(Scan)
admin.site.register(ScanMaterial)
admin.site.register(ScanProject)