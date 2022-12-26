from django.urls import path
from location import views

urlpatterns = [
    path("autocomplete/city", views.CityAutocompleteAPIView.as_view(), name = "location-autocomplete-city"),
    path("autocomplete/district", views.DistrictAutocompleteAPIView.as_view(), name = "location-autocomplete-district"),
]