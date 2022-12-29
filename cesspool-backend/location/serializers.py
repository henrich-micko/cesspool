from rest_framework import serializers
from location import validators, models

from account.models import UserAccount
from utils.serializers import _ModelSerializer

class DistrictCityField(serializers.CharField):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.validators.append(validators.district_city_validation)

class ManagerField(serializers.EmailField):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.validators.append(validators.manager_validation)

    def get_attribute(self, instance):
        return instance.manager

class CitySerializer(_ModelSerializer):
    manager = ManagerField()

    class Meta:
        model = models.City
        fields = [
            "id",
            "title",
            "district",
            "manager"
        ]
        extra_kwargs = {
            "title": { "read_only": True },
            "district": { "read_only": True },
            "manager": { "read_only": True, "ignore_on_create": True }
        }

    def validate(self, attrs):
        super_output = super().validate(attrs)
        
        district, city = super_output.get("district"), super_output.get("title")
        validators.district_city_validation(value = f"{district}/{city}")

        return super_output

    def on_instance_modify(self, validated_data):
        manager_email = validated_data.pop("manager", None)
        if manager_email != None:
            self.instance.manager = UserAccount.objects.get(email = manager_email)
            self.instance.save()