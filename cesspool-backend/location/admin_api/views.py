from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from location.models import City
from location.admin_api.serializers import CityForAdminSerializer

from utils.mixins import MultipleFieldLookupMixin
from utils.generics import RestoreModelAPIView


class _CityAdminAPIView(MultipleFieldLookupMixin):

    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CityForAdminSerializer
    lookup_fields = ["district", "title"]

    def get_queryset(self):
        return City.objects.all()


class CreateCityAPIView(_CityAdminAPIView, CreateAPIView):
    pass


class GPDCityAPIView(_CityAdminAPIView, RetrieveUpdateDestroyAPIView):  
    pass


class ListCityAPIView(_CityAdminAPIView, ListAPIView):
    pass


class RestoreCityAPIView(_CityAdminAPIView, RestoreModelAPIView):
    pass