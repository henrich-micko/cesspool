from utils.permission import has_user_permission
from location.utils import split_location
from cesspool.city_manager_api.serializer import CesspoolForCityManagerSerializer
from cesspool.models import CesspoolToUser, Cesspool


class CesspoolCityManagerMixins:
    permission_classes = has_user_permission("location.be_city_admin")
    serializer_class = CesspoolForCityManagerSerializer
    lookup_field = "code"

    def get_queryset(self):
        output = Cesspool.objects.filter(
            pk__in = [
                ctu.cesspool.pk 
                for ctu in CesspoolToUser.objects.filter(is_super_owner = True, user = self.request.user)
            ]
        )

        # filter by location
        location = self.request.GET.get("city", None)
        district, city = split_location(location)
        output = output.filter(city__title = city, city__district = district) if district and city else output
        
        return output