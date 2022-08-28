from django.urls import path
from rest_framework.authtoken import views as rest_framework_views

from . import views

urlpatterns = [
    path("create/", views.CreateUserAPIView.as_view(), name = "create-account"),
    path("login/", rest_framework_views.obtain_auth_token, name = "login-account"),
    path("logoutall/", views.LogoutAllAPIView.as_view(), name = "logoutall-account"),
    path("whoami/", views.WhoAmIAPIview.as_view(), name = "whoami-account"),
    path("accounts/", views.AdminAccountsAPIView.as_view(), name = "admin-all")
]