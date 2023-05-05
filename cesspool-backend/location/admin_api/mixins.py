from utils.mixins import MultipleFieldLookupMixin
from utils.permission import has_user_permission
from location.admin_api.serializers import CityForAdminSerializer
from location.models import City
from rest_framework.permissions import IsAuthenticated


class CityAdminMixin(MultipleFieldLookupMixin):
    permission_classes =[IsAuthenticated, *has_user_permission("location.manage_city")]
    serializer_class = CityForAdminSerializer
    lookup_fields = ["district", "title"]

    def get_queryset(self):
        manager_filter = self.request.GET.get("manager")
        created_by_filter = self.request.GET.get("created_by")
        queryset = City.objects.all()

        if manager_filter:
            try: queryset = queryset.filter(manager = int(manager_filter))
            except ValueError: pass

        if created_by_filter:
            try: queryset = queryset.filter(created_by = int(created_by_filter))
            except ValueError: pass

        return queryset