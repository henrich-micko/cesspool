from django.urls import path

from . import views

urlpatterns = [
    path("", views.AdminMachineListAPIView.as_view(), name = "admin-machines-detail"),
    path("create/", views.AdminMachineCreateAPIView.as_view(), name = "admin-machines-create"),
    path("<str:machine_code>/", views.AdminMachineAPIView.as_view(), name = "admin-machines-detail-spec"),
    path("<str:machine_code>/record/", views.AdminMachineRecordAPIView.as_view(), name = "admin-machines-record"),
    path("<str:machine_code>/restore/", views.MachineAbortDeleteAPIView.as_view(), name = "admin-machines-record"),
    path("<str:machine_code>/record/restore/", views.MachineAbortDeleteRecordsAPIView.as_view(), name = "admin-machines-record")
]