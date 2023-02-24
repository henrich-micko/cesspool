from django.urls import path
from location import views

urlpatterns = [
    path("autocomplete/city", views.CityAutocompleteAPIView.as_view(), name = "location-autocomplete-city"),
    path("autocomplete/district", views.DistrictAutocompleteAPIView.as_view(), name = "location-autocomplete-district"),
    path("city/<str:district>/<str:title>/csv/", views.CSVCityAPIView.as_view(), name = "location-city-csv"),
    path("city/<str:district>/<str:title>", views.GetCityAPIView.as_view(), name = "location-city-get"),
    path("city/", views.ListCityAPIView.as_view(), name = "location-city-all"),
    path("city/<str:district>/<str:title>", views.GetCityAPIView.as_view(), name = "location-city-get"),
]