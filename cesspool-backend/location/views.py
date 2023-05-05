from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from django.conf import settings
from django.http.response import HttpResponse as DjangoHttpResponse

from location.autocomplete import autocomplete_city, autocomplete_district
from location.mixins import CityManagerMixin, CityManagerOrAdminMixin
from utils.utils import try_parse_get_param



class CityAutocompleteAPIView(APIView):
    permission_classes =[IsAuthenticated]

    def get(self, request):
        value = request.GET.get("value", None)
        district = request.GET.get("d", None)
        if value == None: return Response(status = status.HTTP_400_BAD_REQUEST)

        output = autocomplete_city(settings.LOCATION_FILE, value, district = district)
        return Response(data = output, status = status.HTTP_200_OK)


class DistrictAutocompleteAPIView(APIView):
    permissionss = [IsAuthenticated]

    def get(self, request):
        value = request.GET.get("value", None)
        if value == None: return Response(status = status.HTTP_400_BAD_REQUEST)

        output = autocomplete_district(settings.LOCATION_FILE, value)
        return Response(data = output, status = status.HTTP_200_OK)


class CSVCityAPIView(CityManagerOrAdminMixin, APIView):
    
    def get(self, request, district, title):        
        city = self.get_object()

        response = DjangoHttpResponse(
            content_type = "text/csv",
            headers = {"Content-Disposition": f'attachment; filename="zumpomer_data.csv"'},
        )

        return city.write_csv(response)


class ListCityAPIView(CityManagerMixin, ListAPIView):
    pass


class GetCityAPIView(CityManagerMixin, RetrieveAPIView):
    pass