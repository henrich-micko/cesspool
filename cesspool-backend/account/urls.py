from django.urls import path
from rest_framework.authtoken import views as rest_framework_views

from . import views

urlpatterns = [
    path("create/", views.CreateUserView.as_view(), name = "account_create"),
    path("login/", rest_framework_views.obtain_auth_token, name = "account_login"),
    path("logoutall/", views.LogoutAll.as_view(), name = "account_loginoutall"),
    path("whoami/", views.WhoAmI.as_view(), name = "account_say_my_name")
]