from django.urls import path
from location.admin_api import views


urlpatterns = [
    path("city/", views.list_city_api_view, name = "location-city-list"),
    path("city/create", views.create_city_api_view, name = "location-city-create"),
    path("city/c/<str:district>/<str:title>", views.gpd_city_api_view, name = "location-city"),
    path("city/c/<str:district>/<str:title>/restore/", views.restore_city_api_view, name = "location-city-restore"),
]