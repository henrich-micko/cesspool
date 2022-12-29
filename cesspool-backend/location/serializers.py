from rest_framework import serializers
from location import validators, models

from account.models import UserAccount
from utils.serializers import MSWithListners

class DistrictCityField(serializers.CharField):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.validators.append(validators.district_city_validation)

class ManagerField(serializers.EmailField):
    def __init__(self, **kwargs):
        kwargs["allow_blank"], kwargs["allow_null"] = True, True
        super().__init__(**kwargs)

        self.validators.append(validators.manager_validation)

    def get_attribute(self, instance):
        return instance.manager

class CitySerializer(MSWithListners):
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
            "manager": { "read_only": True, "ignore_on_save": True }
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