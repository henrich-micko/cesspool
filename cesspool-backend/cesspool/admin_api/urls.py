from django.urls import path

from cesspool.admin_api import views


urlpatterns = [
    path("/", views.ListCesspoolAPIView.as_view(), name = "cesspool-admin-list"),
    path("create/", views.CreateCesspoolAPIView.as_view(), name = "cesspool-admin-create"),
    path("<str:code>", views.RUDCesspoolAPIView.as_view(), name = "cesspool-admin-rud"),
    path("<str:code>/restore", views.RestoreCesspoolAPIView.as_view(), name = "cesspool-admin-restore"),
]