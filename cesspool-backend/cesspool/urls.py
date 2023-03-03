from django.urls import path

from cesspool import views


urlpatterns = [
    path("", views.ListCesspolAPIView.as_view(), name = "cesspool-list"),
    path("<str:cesspool__code>/", views.RUDAPIView.as_view(), name = "cesspool-rtu"),
    path("<str:cesspool_code>/records/support", views.RecordsSupportAPIView.as_view(), name = "records-support"),
    path("<str:cesspool_code>/records/date/<str:date>", views.RecordsDateAPIView.as_view(), name = "records-date"),
    path("<str:cesspool_code>/records/<str:tf>", views.RecordsAPIView.as_view(), name = "records"),
]