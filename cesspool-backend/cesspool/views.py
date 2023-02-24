from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView

from utils.permission import has_user_permission
from cesspool.serializers import CesspoolToUserSerializer
from cesspool.models import CesspoolToUser


class BaseCesspoolToOwner:

    permission_classes = [IsAuthenticated, *has_user_permission("cesspool.related_to_cesspool")]
    serializer_class = CesspoolToUserSerializer
    lookup_field = "cesspool__code"
    lookup_value_regex = "[^/]+"

    def get_queryset(self):
        return CesspoolToUser.objects.filter(user = self.request.user)
    

class ListCesspolAPIView(BaseCesspoolToOwner, 
                         ListAPIView):
    pass


class RUDAPIView(BaseCesspoolToOwner, 
                 RetrieveUpdateAPIView):
    pass