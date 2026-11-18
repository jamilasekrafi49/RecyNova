from django.contrib import admin

# Register your models here.
# materials/admin.py
from django.contrib import admin
from .models import Material

admin.site.register(Material)