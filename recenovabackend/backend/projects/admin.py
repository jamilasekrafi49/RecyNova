from django.contrib import admin

# Register your models here.
# projects/admin.py
from django.contrib import admin
from .models import Project

admin.site.register(Project)