from django.urls import path

from cesspool import views


urlpatterns = [
    path("cesspool", views.ListCesspolAPIView.as_view(), name = "cesspool-list"),
    path("cesspool/<str:cesspool__code>", views.RUDAPIView.as_view(), name = "cesspool-rtu"),
]