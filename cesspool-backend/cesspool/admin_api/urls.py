from django.urls import path

from cesspool.admin_api import views


urlpatterns = [
    path("", views.ListCesspoolAPIView.as_view(), name = "cesspool-admin-list"),
    path("code", views.GenerateCesspoolCodeAPIView.as_view(), name = "cesspool-code-generate"),
    path("create", views.CreateCesspoolAPIView.as_view(), name = "cesspool-admin-create"),
    path("c/<str:code>", views.RUDCesspoolAPIView.as_view(), name = "cesspool-admin-rud"),
    path("c/<str:code>/restore", views.RestoreCesspoolAPIView.as_view(), name = "cesspool-admin-restore"),
]