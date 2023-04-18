from django.shortcuts import get_object_or_404
from utils.permission import has_user_permission, perm_or
from cesspool.records_api.serializers import RecordSerializer
from cesspool.models import Cesspool, CesspoolToUser


class RecordsMixin:
    permissions = [ perm_or(has_user_permission("cesspool.related_to_cesspool"), has_user_permission("cesspool.manage_cesspool")) ]
    lookup_field = "cesspool__code"
    lookup_value_regex = "[^/]+"
    serializer_class = RecordSerializer

    def get_queryset(self):
        cesspool = get_object_or_404(Cesspool.objects.all(), code = self.kwargs.get("cesspool__code"))

        # when user is not manager only maybe related
        if not self.request.user.has_perm("cesspool.manage_cesspool"):
            get_object_or_404(CesspoolToUser.objects.all(), user = self.request.user, cesspool = cesspool)

        return cesspool.record_set.all()