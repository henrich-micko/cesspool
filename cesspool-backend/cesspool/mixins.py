from utils.permission import has_user_permission
from cesspool.models import CesspoolToUser
from cesspool.serializers import CesspoolToUserSerializer, CesspoolToUserWithUsersSerializer
from utils.utils import try_get_instance
from rest_framework.permissions import IsAuthenticated


class CTUMixin:
    permission_classes =[IsAuthenticated ,*has_user_permission("cesspool.related_to_cesspool")]
    lookup_field = "cesspool__code"
    lookup_value_regex = "[^/]+"

    @property
    def serializer_class(self):
        user, cesspool = self.request.user, self.kwargs.get("cesspool__code")
        is_super_owner = try_get_instance(CesspoolToUser, user = user, cesspool__code = cesspool, field = "is_super_owner")
        return CesspoolToUserWithUsersSerializer if is_super_owner else CesspoolToUserSerializer

    def get_queryset(self):
        return CesspoolToUser.objects.filter(user = self.request.user)