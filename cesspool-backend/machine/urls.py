from django.urls import path
from  . import views

urlpatterns = [
    path("my/", views.my_machines_view, name = "machine_my_machine"),
    path("<str:code>/", views.machine_detail_view, name = "machine_machine_detail"),
    path("<str:code>/records/", views.records_view, name = "machine_records")
]