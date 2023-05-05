from django.shortcuts import get_object_or_404

from utils.permission import has_user_permission, perm_or
from utils.mixins import MultipleFieldLookupMixin
from location.serializers import CitySerializer
from location.models import City
from rest_framework.permissions import IsAuthenticated


class CityManagerMixin(MultipleFieldLookupMixin):
    permissions = [IsAuthenticated ,*has_user_permission("location.be_city_admin")]
    serializer_class = CitySerializer
    lookup_fields = ["district", "title"]

    def get_queryset(self):
        return City.objects.filter(manager = self.request.user)
    

class CityManagerOrAdminMixin(CityManagerMixin):
    permissions = [IsAuthenticated, perm_or(
        *has_user_permission("location.be_city_admin"), *has_user_permission("location.manage_city")
    )]

    def get_queryset(self):
        if self.request.user.has_perm("location.manage_city"):
            return City.objects.all()
        return City.objects.filter(manager = self.request.user)
    