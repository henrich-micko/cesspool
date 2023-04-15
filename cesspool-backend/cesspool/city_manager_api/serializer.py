from rest_framework import serializers
from cesspool.serializer_fields import CesspoolOwnerField
from location.serializers import DistrictCityField # dont ask me a thing
from cesspool.models import Cesspool


class CesspoolForCityManagerSerializer(serializers.ModelSerializer):
    owner = CesspoolOwnerField(read_only = False, required = False, allow_null = True)
    city = DistrictCityField(required = True)

    class Meta:
        model = Cesspool
        fields = [
            "id",
            "code",
            "city",
            "owner",
        ]