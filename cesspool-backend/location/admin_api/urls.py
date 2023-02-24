from django.urls import path
from location.admin_api import views


urlpatterns = [
    path("city/", views.ListCityAPIView.as_view(), name = "location-city-list"),
    path("city/create", views.CreateCityAPIView.as_view(), name = "location-city-create"),
    path("city/<str:district>/<str:title>", views.GPDCityAPIView.as_view(), name = "location-city"),
    path("city/<str:district>/<str:title>/restore/", views.RestoreCityAPIView.as_view(), name = "location-city-restore"),
]