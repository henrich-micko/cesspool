from django.urls import path
from  . import views

urlpatterns = [
    path("all/", views.MachinesListView.as_view(), name = "machine_all"),
]