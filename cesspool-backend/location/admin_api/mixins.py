from utils.mixins import MultipleFieldLookupMixin
from utils.permission import has_user_permission
from location.admin_api.serializers import CityForAdminSerializer
from location.models import City


class CityAdminMixin(MultipleFieldLookupMixin):
    permissions = has_user_permission("location.manage_city")
    serializer_class = CityForAdminSerializer
    lookup_fields = ["district", "title"]

    def get_queryset(self):
        return City.objects.all()