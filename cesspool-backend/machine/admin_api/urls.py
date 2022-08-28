from django.urls import path

from . import views

urlpatterns = [
    path("", views.AdminMachineListAPIView.as_view(), name = "admin-machines-detail"),
    path("create/", views.AdminMachineCreateAPIView.as_view(), name = "admin-machines-create"),
    path("<str:machine_code>/", views.AdminMachineAPIView.as_view(), name = "admin-machines-detail-spec")
]