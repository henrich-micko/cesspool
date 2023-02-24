from django.urls import path

from . import views

urlpatterns = [
    path("account/", views.ListUserAccountAPIView.as_view(), name = "admin-accounts-detail"),
    path("account/create/", views.CreateUserAccountAPIView.as_view(), name = "admin-account-create"),
    path("account/<int:pk>/", views.RUDUserAccountAPIView.as_view(), name = "admin-account-detail"),
    path("account/<int:pk>/restore/", views.RestoreUserAccountAPIView.as_view(), name = "admin-account-detail"),
]