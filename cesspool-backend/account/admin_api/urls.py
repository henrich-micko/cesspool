from django.urls import path

from . import views

urlpatterns = [
    path("", views.AdminAccountListAPIView.as_view(), name = "admin-accounts-detail"),
    path("create/", views.UserAccountCreateAPIView.as_view(), name = "admin-account-create"),
    path("<int:user_pk>/", views.UserAccountAPIView.as_view(), name = "admin-account-detail"),
    path("<int:user_pk>/restore/", views.UserAbortDeleteAPIView.as_view(), name = "admin-account-detail"),
    path("<int:user_pk>/machines/", views.UserMachineAPIView.as_view(), name = "admin-machine"),
    path("<int:user_pk>/machines/restore/", views.UserAbortDeleteMachinesAPIView.as_view(), name = "admin-machine"),
]