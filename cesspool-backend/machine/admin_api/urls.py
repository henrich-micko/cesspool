from django.urls import path

from . import views

urlpatterns = [
    path("", views.AdminMachineListAPIView.as_view(), name = "admin-machines-detail"),
    path("get-code/", views.MachineCodeGenerateAPIView.as_view(), name = "machine-get-code"),
    path("create/", views.AdminMachineCreateAPIView.as_view(), name = "admin-machines-create"),
    path("user/<int:user_pk>/", views.AdminMachineListOfUserAPIView.as_view(), name = "admin-machines-list-of-user"),
    path("<str:machine_code>/", views.AdminMachineAPIView.as_view(), name = "admin-machines-detail-spec"),
    path("<str:machine_code>/record/", views.AdminMachineRecordAPIView.as_view(), name = "admin-machines-record"),
    path("<str:machine_code>/restore/", views.MachineAbortDeleteAPIView.as_view(), name = "admin-machines-record"),
    path("<str:machine_code>/record/restore/", views.MachineAbortDeleteRecordsAPIView.as_view(), name = "admin-machines-record"),
]