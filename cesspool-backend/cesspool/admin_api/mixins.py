from django.shortcuts import get_object_or_404
from utils.permission import has_user_permission
from cesspool.admin_api.serializers import CesspoolForAdminSerializer
from cesspool.models import Cesspool, CesspoolToUser
from location.utils import split_location


class CesspoolAdminMixin:
    permissions = has_user_permission("cesspool.manage_cesspool")
    serializer_class = CesspoolForAdminSerializer
    lookup_field = "code"

    def get_queryset(self):
        user_filter = self.request.GET.get("user") # owner my bad sry
        location_filter = self.request.GET.get("city")
        cesspool_queryset = Cesspool.objects.all()        

        if user_filter:
            print(user_filter)
            cesspool_queryset = cesspool_queryset.filter(
                pk__in = [ctu.cesspool.pk for ctu in CesspoolToUser.objects.filter(user__pk = user_filter)]
            )
        
        if location_filter:
            district, city = split_location(location_filter)
            if district and city:
                cesspool_queryset = cesspool_queryset.filter(
                    city__title = city,
                    city__district = district
                )

        return cesspool_queryset            
            