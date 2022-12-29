from rest_framework import serializers
from rest_framework.validators import ValidationError

from machine import models
from account.models import UserAccount

from location.models import City
from location.serializers import DistrictCityField


def remove_from_list(array, value):
    if value in array:
        array.remove(value)
        return True
    return False

class MachineUsersField(serializers.ListField):

    def __init__(self, **kwargs):
        kwargs["child"] = serializers.EmailField()
        super().__init__(**kwargs)
        self.validators.append(MachineUsersField._validate_user_exists)

    @staticmethod
    def _validate_user_exists(value):
        for user_email in value:
            try: UserAccount.objects.get(email = user_email)
            except UserAccount.DoesNotExist:
                raise ValidationError(f"User {user_email} doesnt exists")

    def get_attribute(self, instance):
        mtu = models.MachineToUser.objects.filter(machine = instance)
        users = [i.user.email for i in mtu]
        return users

class MachineDetialForAdminSerializer(serializers.ModelSerializer):
    
    users = MachineUsersField()
    delete_date = serializers.SerializerMethodField()
    delete_records_date = serializers.SerializerMethodField()
    records = serializers.SerializerMethodField()
    last_update = serializers.SerializerMethodField()
    problems = serializers.SerializerMethodField()

    city = DistrictCityField()

    class Meta:
        model = models.Machine
        fields = [
            "users",
            "code", 
            "mqtt", 
            "notification", 
            "delete_date", 
            "delete_records_date",
            "records",
            "last_update",
            "problems",
            "city",
        ]
        extra_kwargs = {
            "code": {
                "required": False
            }, 
            "users": {
                "required": False
            }
        }

    def get_delete_date(self, obj):
        action = obj.one_to_one(models.MachineDeleteAction)
        if action != None:
            return action.date
        return None

    def get_delete_records_date(self, obj):
        action = obj.one_to_one(models.MachineDeleteRecordsAction)
        if action != None:
            return action.date
        return None

    def get_last_update(self, obj: models.Machine):
        return obj.last_update

    def get_problems(self, obj: models.Machine):
        problems = models.scan_problems(obj)

        return [
            {"detail": problem.detail, "importance": problem.importance}
            for problem in problems
        ]

    def get_records(self, obj):
        return len(obj.record_set.all())

    def create(self, validated_data):
        if not "code" in validated_data.keys():
            validated_data["code"] = models.Machine.objects.get_machine_code()

        users = validated_data.pop("users")
        city = validated_data.pop("city")

        instance = super().create(validated_data)
        self.on_save(instance, {"users": users, "city": city, **validated_data})

        return instance

    def update(self, instance, validated_data):
        self.on_save(instance, validated_data)

        return super().update(instance, validated_data)

    def on_save(self, instance, validated_data):
        users = [
            UserAccount.objects.get(email = e) for e in validated_data.pop("users", [])
        ]

        instance.assign_to_users(
            users = users,
            remove_not_included = True
        )

        city_value = validated_data.pop("city", None)
        if city_value != None:
            district, city_title = city_value.split("/")
            city, created = City.objects.get_or_create(title = city_title, district = district)
   
            instance.city = city
            instance.save()