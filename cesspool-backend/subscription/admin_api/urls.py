from django.urls import path
from subscription.admin_api import views


urlpatterns = [
    path("subs/", views.ListSubscriptionAPIView.as_view()),
    path("subs/create/", views.CreateSubscriptionAPIView.as_view()),
    path("subs/<str:title>/", views.RUDSubscriptionAPIView.as_view())
]