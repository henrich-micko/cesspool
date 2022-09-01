from django.urls import path

from . import views

urlpatterns = [
    path("", views.AdminAccountListAPIView.as_view(), name = "admin-account-detail"),
]