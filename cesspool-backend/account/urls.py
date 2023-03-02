from django.urls import path
from rest_framework.authtoken import views as rest_framework_views

from . import views

urlpatterns = [
    path("", views.WhoAmIAPIview.as_view(), name = "account"),
    path("login/", rest_framework_views.obtain_auth_token, name = "login-account"),
    path("logoutall/", views.LogoutAllAPIView.as_view(), name = "logoutall-account"),
    path("reset-password/", views.ResetPasswordAPIView.as_view(), name = "reset-password"),
    path("reset-password/submit/", views.ResetPasswordSubmitAPIView.as_view(), name = "reset-password-submit"),
    path("activate/submit/", views.ActivateUserAPIView.as_view(), name = "activate-user"),
]