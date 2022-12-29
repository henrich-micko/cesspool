from location.serializers import CitySerializer


class CityForAdminSerializer(CitySerializer):

    class Meta(CitySerializer.Meta):
        extra_kwargs = {
            "title": { "read_only": False },
            "district": { "read_only": False },
            "delete_at": { "read_only": True },
            "manager": { "read_only": False, "ignore_on_save": True },
        }