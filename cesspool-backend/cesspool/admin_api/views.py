from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from cesspool.utils import generate_cesspool_code
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
        print("x")
        return Response({
            "value": generate_cesspool_code()
        }, status = status.HTTP_200_OK)
    
generate_cesspool_code_api_view = GenerateCesspoolCodeAPIView.as_view()