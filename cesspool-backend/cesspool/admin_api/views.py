from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from cesspool.serializers import CesspoolSerializer
from cesspool.models import Cesspool
from utils.generics import RestoreModelAPIView


class BaseCesspoolAdminAPIView:

    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = CesspoolSerializer
    lookup_field = "code"

    def get_queryset(self):
        return Cesspool.objects.all()
    

class CreateCesspoolAPIView(BaseCesspoolAdminAPIView, 
                            CreateAPIView):
    pass


class ListCesspoolAPIView(BaseCesspoolAdminAPIView, 
                          ListAPIView):
    pass


class RUDCesspoolAPIView(BaseCesspoolAdminAPIView, 
                         RetrieveUpdateDestroyAPIView):
    pass


class RestoreCesspoolAPIView(BaseCesspoolAdminAPIView,
                             RestoreModelAPIView):
    pass