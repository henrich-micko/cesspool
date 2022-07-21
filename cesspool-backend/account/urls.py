from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("create/", views.CreateUserView.as_view(), name = "create_user"),
    path("logout/", views.BlackListTokenView.as_view(), name = "blacklist"),
    path('token/', views.CustomTokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name = 'token_refresh'),
    path("hello/", views.TestView.as_view(), name = "hello")
]