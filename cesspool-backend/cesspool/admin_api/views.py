from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from cesspool.utils import generate_cesspool_code
from cesspool.models import Cesspool
from cesspool.admin_api.mixins import CesspoolAdminMixin
from utils.generics import RestoreModelAPIView, CreateModelWithCreatedByFieldAPIView


class CreateCesspoolAPIView(CesspoolAdminMixin, CreateModelWithCreatedByFieldAPIView):
    pass

create_cesspool_api_view = CreateCesspoolAPIView.as_view()


class ListCesspoolAPIView(CesspoolAdminMixin, ListAPIView):
    pass

list_cesspool_api_view = ListCesspoolAPIView.as_view()


class RUDCesspoolAPIView(CesspoolAdminMixin, RetrieveUpdateDestroyAPIView):
    pass

rud_cesspool_api_view = RUDCesspoolAPIView.as_view()


class RestoreCesspoolAPIView(CesspoolAdminMixin, RestoreModelAPIView):
    pass

restore_cesspool_api_view = RestoreCesspoolAPIView.as_view()


class GenerateCesspoolCodeAPIView(CesspoolAdminMixin, APIView):
    def get(self, request):
        return Response({
            "value": generate_cesspool_code()
        }, status = status.HTTP_200_OK)
    
generate_cesspool_code_api_view = GenerateCesspoolCodeAPIView.as_view()


class GenerateDebugRecordsAPIView(CesspoolAdminMixin, APIView):
    def get(self, request, code):
        cesspool = get_object_or_404(Cesspool.objects.all(), code = code)
        
        if not cesspool.debug_mode:
            return Response(status = status.HTTP_403_FORBIDDEN)
        
        try:
            days = int(request.GET.get("days", 1))
            freq_h = int(request.GET.get("freq",  8))
        except ValueError:
            return Response(status = status.HTTP_400_BAD_REQUEST)
        cesspool.generate_debug_records(days, freq_h)
        return Response(status = status.HTTP_200_OK)

generate_debug_records_api_view = GenerateDebugRecordsAPIView.as_view()