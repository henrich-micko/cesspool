from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from location.models import City
from location.admin_api.serializers import CityForAdminSerializer


class CityCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        sz = CityForAdminSerializer(data = request.data)
        if sz.is_valid():
            sz.save()
            return Response(data = sz.data, status = status.HTTP_200_OK)
        return Response(data = sz.errors, status = status.HTTP_400_BAD_REQUEST)

class CityAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, district, city):
        instance = get_object_or_404(City, district = district, title = city)
        sz = CityForAdminSerializer(instance = instance)
        return Response(sz.data, status = status.HTTP_200_OK)
    
    def put(self, request, district, city):
        instance = get_object_or_404(City, district = district, title = city)
        sz = CityForAdminSerializer(instance = instance, data = request.data)
        if sz.is_valid():
            sz.save()
            return Response(sz.data, status = status.HTTP_200_OK)
        return Response(sz.errors, status = status.HTTP_400_BAD_REQUEST)

class CityListAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        sz = CityForAdminSerializer(City.objects.all(), many = True)
        return Response(sz.data, status = status.HTTP_200_OK)