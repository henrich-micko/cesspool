from django.urls import path
from subscription import views 


urlpatterns = [
    path("", views.SubscriptionListAPIView.as_view()),
    path("s/<str:title>", views.SubscriptionRetrieveAPIView.as_view())
]