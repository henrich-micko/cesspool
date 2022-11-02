from django.urls import path
from  . import views

urlpatterns = [
    path("", views.MachineDetailAPIView.as_view(), name = "machine-detail-all"),
    path("<str:machine_code>/", views.MachineDetailAPIView.as_view(), name = "machine-detail-spec"),
    path("<str:machine_code>/records/support/", views.RecordsSupportAPIView.as_view(), name = "machine-records-support"),
    path("<str:machine_code>/conf/", views.MachineConfAPIView.as_view(), name = "machine-conf"),
    path("<str:machine_code>/records/date/<str:date>", views.DateRecordsAPIView.as_view(), name = "machine-records-date"),
    path("<str:machine_code>/records/<str:time_period>/", views.RecordsAPIView.as_view(), name = "machine-records"),
    path("<str:machine_code>/release-date/", views.MachineReleaseDateAPIView.as_view(), name = "machine-release-date"),
]