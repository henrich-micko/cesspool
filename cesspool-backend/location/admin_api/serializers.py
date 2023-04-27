from location.serializers import CitySerializer
from utils.serializer_fields import created_by_field_repr


class CityForAdminSerializer(CitySerializer):

    class Meta(CitySerializer.Meta):
        fields = [
            *CitySerializer.Meta.fields,
            "created_by",
        ]

        extra_kwargs = {
            "title": { "read_only": False },
            "district": { "read_only": False },
            "delete_at": { "read_only": True },
            "manager": { "read_only": False },
        }

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["created_by"] = created_by_field_repr(instance)
        return response