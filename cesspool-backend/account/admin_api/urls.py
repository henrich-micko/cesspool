from django.urls import path

from . import views

urlpatterns = [
    path("", views.AdminAccountListAPIView.as_view(), name = "admin-accounts-detail"),
    path("create/", views.UserAccountCreateAPIView.as_view(), name = "admin-account-create"),
    path("<int:user_pk>/", views.UserAccountAPIView.as_view(), name = "admin-account-detail"),
]