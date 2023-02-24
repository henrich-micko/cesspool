from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from django.conf import settings
from django.http.response import HttpResponse as DjangoHttpResponse

from location.autocomplete import autocomplete_city, autocomplete_district
from location.serializers import CitySerializer
from location.models import City

from utils.utils import try_parse_get_param
from utils.permission import has_user_permission
from utils.mixins import MultipleFieldLookupMixin


class _CityManagerAPIView(MultipleFieldLookupMixin):

    permission_classes = [IsAuthenticated, *has_user_permission("location.be_city_admin")]
    serializer_class = CitySerializer
    lookup_fields = ["district", "title"]

    def get_queryset(self):
        return City.objects.filter(manager = self.request.user)


class CityAutocompleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        value = request.GET.get("value", None)
        if value == None: return Response(status = status.HTTP_400_BAD_REQUEST)

        output = autocomplete_city(settings.LOCATION_FILE, value)
        return Response(data = output, status = status.HTTP_200_OK)


class DistrictAutocompleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        value = request.GET.get("value", None)
        if value == None: return Response(status = status.HTTP_400_BAD_REQUEST)

        output = autocomplete_district(settings.LOCATION_FILE, value)
        return Response(data = output, status = status.HTTP_200_OK)


class CSVCityAPIView(_CityManagerAPIView, APIView):
    
    def get(self, request, district, title):        
        city = self.get_object()
        month = try_parse_get_param(request, "month")
        if month == None or month < 1 or month > 12:
            return Response({"month": "Month is not int or is not valid month date."}, status = status.HTTP_400_BAD_REQUEST)

        response = DjangoHttpResponse(
            content_type = "text/csv",
            headers = {"Content-Disposition": f'attachment; filename="zumpomer_data_{month}.csv"'},
        )

        return city.write_csv(response, month = month)


class ListCityAPIView(_CityManagerAPIView, ListAPIView):
    pass


class GetCityAPIView(_CityManagerAPIView, RetrieveAPIView):
    pass