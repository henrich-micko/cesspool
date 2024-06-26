"""cesspool_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('api/admin/dashboard', admin.site.urls),

    path("api/account/", include("account.urls"), name = "account"),
    path("api/cesspool/", include("cesspool.urls"), name = "cesspool"),
    path("api/location/", include("location.urls"), name = "location"),
    path("api/subs/", include("subscription.urls"), name = "subscription"),

    path("api/admin/cesspool/", include("cesspool.admin_api.urls"), name = "cesspool-admin"),
    path("api/admin/account/", include("account.admin_api.urls"), name = "account-admin"),
    path("api/admin/location/", include("location.admin_api.urls",), name = "location-admin"),

    path("api/city-manager/cesspool/", include("cesspool.city_manager_api.urls"), name = "city-manager-cesspool"),
]