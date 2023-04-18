from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from cesspool.serializers import CesspoolToUserSerializer, CesspoolToUserWithUsersSerializer
from cesspool.mixins import CTUMixin


class ListCesspolAPIView(CTUMixin, APIView):
    def get(self, request):
        response_data = []
        for ctu in self.get_queryset():
            if ctu.is_super_owner:
                ser = CesspoolToUserWithUsersSerializer(instance = ctu)
            else:
                ser = CesspoolToUserSerializer(instance = ctu)
            response_data.append(ser.data)
        return Response(data = response_data, status = status.HTTP_200_OK)

list_cesspool_api_view = ListCesspolAPIView.as_view()


class RUDCTUAPIView(CTUMixin, RetrieveUpdateAPIView):
    pass

rud_ctu_api_view = RUDCTUAPIView.as_view()