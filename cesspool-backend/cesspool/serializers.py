from rest_framework import serializers

from cesspool.models import Cesspool, CesspoolToUser, Record
from cesspool.serializer_fields import LastRecordField, CesspoolProblemsField, CesspoolUsersField
from location.serializers import DistrictCityField
from location.models import City
from utils.serializers import MSWithListners
from subscription.models import Subscription
from subscription.serializers import SubscriptionSerializer
from account.models import UserAccount


"""
----------------------
   Model serializers
----------------------
"""


class CesspoolSerializer(MSWithListners):
    
    city = DistrictCityField(required = True)
    subscription = serializers.PrimaryKeyRelatedField(read_only = True)
    record = LastRecordField()
    problems = CesspoolProblemsField()

    class Meta:
        model = Cesspool
        fields = [
            "pk",
            "code",
            "city",
            "about",
            "delete_at",
            "subscription",
            "record",
            "problems"
        ]
        extra_kwargs = {
            "delete": { "read_only": False },
            "subscription": { "read_only": False },
            "users": { "ignore_on_save": True },            
            "city": { "ignore_on_save": True },
            "subscription": { "ignore_on_save": True }
        }

    def on_create_and_update(self, instance, validated_data):
        
        # store city
        city_dt = validated_data.get("city")
        if not city_dt == None:
            district, title = city_dt.split("/")
            city, created = City.objects.get_or_create(district = district, title = title)
            
            instance.city = city
            instance.save()

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["subscription"] = SubscriptionSerializer(instance = instance.subscription).data
        return response


class CesspoolToUserSerializer(MSWithListners):
    user = serializers.EmailField(source = "user.email", read_only = True)
    cesspool = CesspoolSerializer(read_only = True)

    class Meta:
        model = CesspoolToUser
        fields = [
            "pk",
            "user",
            "is_super_owner",
            "title",
            "contact_at_level",
            "cesspool",
        ]


class CesspoolToUserWithUsersSerializer(CesspoolToUserSerializer):
    cesspool_users = CesspoolUsersField(source_ = "cesspool", read_only = False, required = False)

    class Meta(CesspoolToUserSerializer.Meta):
        fields = [
            *CesspoolToUserSerializer.Meta.fields, 
            "cesspool_users",
        ]
        extra_kwargs = {
            "cesspool_users": { "ignore_on_save": True }
        }

        # is_super_owner is read only False as default
    def on_create_and_update(self, instance: CesspoolToUser, validated_data):        
        users = validated_data.pop("cesspool_users", None)
        if users == None: return

        # filter so only allowed amount of users will be added
        max_owners = instance.cesspool.subscription.max_owners
        if max_owners < len(users):
            users = users[0:max_owners]

        for user in users:
            user, user_created = UserAccount.objects.get_or_create(email = user)
            if user_created:
                user.is_active = False
                user.save()
            CesspoolToUser.objects.get_or_create(cesspool = instance.cesspool, user = user)
        
        CesspoolToUser.objects.exclude(user__email__in = users).delete()


class RecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Record
        fields = [
            "pk",
            "level_m",
            "level_percent",
            "battery",
            "date"
        ]