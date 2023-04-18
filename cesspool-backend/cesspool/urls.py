from django.urls import path, include
from cesspool import views


urlpatterns = [
    path("c/", views.list_cesspool_api_view, name = "cesspool-list"),
    path("c/<str:cesspool__code>", views.rud_ctu_api_view, name = "cesspool-rtu"),
    path("c/<str:cesspool__code>/records", include("cesspool.records_api.urls"), name = "cesspool-records")
]