from django.urls import path
from location.admin_api import views


urlpatterns = [
    path("city/", views.CityListAPIView.as_view(), name = "location-city-list"),
    path("city/create", views.CityCreateAPIView.as_view(), name = "location-city-create"),
    path("city/<str:district>/<str:city>", views.CityAPIView.as_view(), name = "location-city"),
    path("city/<str:district>/<str:title>/restore/", views.RsCityAPIView.as_view(), name = "location-city-restore")
]