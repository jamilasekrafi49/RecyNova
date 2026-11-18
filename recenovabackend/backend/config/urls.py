
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentification JWT
    path('api/auth/', include('users.urls')),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Applications RecyNova
    path('api/scans/', include('scans.urls')),
    path('api/materials/', include('materials.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/eco-score/', include('eco_score.urls')),
]
