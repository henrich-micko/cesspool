from location.serializers import CitySerializer


class CityForAdminSerializer(CitySerializer):

    class Meta(CitySerializer.Meta):
        extra_kwargs = {
            "title": { "read_only": False },
            "district": { "read_only": False },
            "manager": { "read_only": False }
        }