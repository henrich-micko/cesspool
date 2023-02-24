from django.urls import path
from subscription import views 


urlpatterns = [
    path("subs/", views.SubscriptionListAPIView.as_view()),
    path("subs/<str:title>", views.SubscriptionRetrieveAPIView.as_view())
]