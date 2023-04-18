from django.urls import path
from cesspool.records_api import views


urlpatterns = [
    path("/support/", views.records_by_tf_support_api_view, name = "records-filter-by-tf-support"),
    path("/date/<int:year>/<int:month>/<int:day>/", views.records_by_date_api_view, name = "records-filter-by-date"),
    path("/<str:tf>/", views.records_by_tf_api_view, name = "records-filter-by-tf"),
]