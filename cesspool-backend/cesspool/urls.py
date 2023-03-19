from django.urls import path

from cesspool import views


urlpatterns = [
    path("c/", views.ListCesspolAPIView.as_view(), name = "cesspool-list"),
    path("c/<str:cesspool__code>/", views.RUDAPIView.as_view(), name = "cesspool-rtu"),
    path("c/<str:cesspool_code>/records/support/", views.RecordsSupportAPIView.as_view(), name = "records-support"),
    path("c/<str:cesspool_code>/records/date/<str:date>/", views.RecordsDateAPIView.as_view(), name = "records-date"),
    path("c/<str:cesspool_code>/records/<str:tf>/", views.RecordsAPIView.as_view(), name = "records"),
]