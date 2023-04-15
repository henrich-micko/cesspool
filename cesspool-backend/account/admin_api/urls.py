from django.urls import path

from . import views

urlpatterns = [
    path("", views.ListUserAccountAPIView.as_view(), name = "admin-accounts-detail"),
    path("create/", views.CreateUserAccountAPIView.as_view(), name = "admin-account-create"),
    path("a/<int:pk>/", views.RUDUserAccountAPIView.as_view(), name = "admin-account-detail"),
    path("a/<int:pk>/restore/", views.RestoreUserAccountAPIView.as_view(), name = "admin-account-detail"),
    path("groups/", views.GroupsAPIView.as_view(), name = "groups")
]