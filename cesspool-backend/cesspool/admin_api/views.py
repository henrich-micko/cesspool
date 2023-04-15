from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cesspool.admin_api.serializers import CesspoolForAdminSerializer
from cesspool.utils import generate_cesspool_code
from cesspool.models import Cesspool, CesspoolToUser
from utils.generics import RestoreModelAPIView
from utils.permission import has_user_permission
from location.models import City
from location.utils import split_location


class BaseCesspoolAdminAPIView:

    permission_classes = [IsAuthenticated, *has_user_permission("cesspool.manage_cesspool")]
    serializer_class = CesspoolForAdminSerializer
    lookup_field = "code"

    def get_queryset(self):
        user = self.request.GET.get("user", None)
        location = self.request.GET.get("city", None)
        output = Cesspool.objects.all()
        
        if user:
            output = output.filter(
                pk__in = [ctu.cesspool.pk for ctu in CesspoolToUser.objects.filter(user = user)]
            )

        if location:
            city, district = split_location(location)
            try: 
                city = City.objects.get(district = district)
                output = output.filter(city = city)
            except City.DoesNotExist:
                print("oh, no")
        return output

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


class GenerateCesspoolCodeAPIView(APIView):
    permission_classes = has_user_permission("cesspool.manage_cesspool")

    def get(self, request):
        return Response({"value": generate_cesspool_code()}, status = status.HTTP_200_OK)