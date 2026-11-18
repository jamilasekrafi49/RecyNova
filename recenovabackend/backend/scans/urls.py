from django.urls import path
from .views import ScanListCreateView

urlpatterns = [
    path('', ScanListCreateView.as_view(), name='scan-list-create'),
]