from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from django.conf import settings
from django.shortcuts import get_object_or_404

from location.autocomplete import autocomplete_city, autocomplete_district
from location.serializers import CitySerializer
from location.models import City


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