from django.urls import path

from cesspool import views


urlpatterns = [
    path("", views.ListCesspolAPIView.as_view(), name = "cesspool-list"),
    path("<str:cesspool__code>/", views.RUDAPIView.as_view(), name = "cesspool-rtu"),
]