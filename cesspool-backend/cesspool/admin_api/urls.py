from django.urls import path

from cesspool.admin_api import views


urlpatterns = [
    path("cesspool", views.ListCesspoolAPIView.as_view(), name = "cesspool-admin-list"),
    path("cesspool/create/", views.CreateCesspoolAPIView.as_view(), name = "cesspool-admin-create"),
    path("cesspool/<str:code>", views.RUDCesspoolAPIView.as_view(), name = "cesspool-admin-rud"),
    path("cesspool/<str:code>/restore", views.RestoreCesspoolAPIView.as_view(), name = "cesspool-admin-restore"),
]