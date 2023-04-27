from rest_framework import serializers

from location import validators, models
from location.serializer_fields import city_manager_repr_field
from account.models import UserAccount
from utils.serializers import MSWithListners


class DistrictCityField(serializers.CharField):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.validators.append(validators.district_city_validation)


class CitySerializer(MSWithListners):
    
    class Meta:
        model = models.City
        fields = [
            "id",
            "title",
            "district",
            "delete_at",
            "manager",
        ]
        extra_kwargs = {
            "title": { "read_only": True },
            "district": { "read_only": True },
            "delete_at": { "read_only": True },
            "manager": { "read_only": True }
        }

    def validate(self, attrs):
        super_output = super().validate(attrs)
        district, city = super_output.get("district"), super_output.get("title")
        validators.district_city_validation(value = f"{district}/{city}")

        return super_output

    def on_create_and_update(self, instance, validated_data):
        manager_email = validated_data.get("manager")

        if manager_email != None: 
            instance.manager = UserAccount.objects.get(email = manager_email)
        else:
            instance.manager = None
        instance.save()

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["manager"] = city_manager_repr_field(instance)
        return response