from django.urls import path
from .views import EcoLogListCreateView

urlpatterns = [
    path('', EcoLogListCreateView.as_view(), name='eco-log-list-create'),
]