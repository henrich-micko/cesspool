from django.urls import path
from cesspool.city_manager_api import views


urlpatterns = [
    path("", views.list_cesspool_api_view, name = "city-manager-list-cesspool"),
    path("c/<str:code>", views.retrieve_cesspool_api_view, name = "city-manager-retrieve-cesspool"),
]