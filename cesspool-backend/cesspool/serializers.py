from rest_framework import serializers

from cesspool.models import Cesspool, CesspoolToUser
from cesspool.serializer_fields import CesspoolUsersField, SubscriptionField
from location.serializers import DistrictCityField
from location.models import City
from utils.serializers import MSWithListners
from utils.utils import get_user_model
from subscription.models import Subscription


class CesspoolToUserSerializer(serializers.ModelSerializer):
    cesspool = serializers.CharField(source = "cesspool.code", read_only = True)
    user = serializers.EmailField(source = "user.email", read_only = True)

    class Meta:
        model = CesspoolToUser
        fields = [
            "pk",
            "user",
            "cesspool",
            "title",
            "contact_at_level",
        ]


class CesspoolSerializer(MSWithListners):
    city = DistrictCityField(required = True)
    users = CesspoolUsersField(required = True)
    subscription = SubscriptionField()

    class Meta:
        model = Cesspool
        fields = [
            "pk",
            "code",
            "city",
            "users",
            "about",
            "delete_at",
            "subscription",
        ]
        extra_kwargs = {
            "delete": { "read_only": False },
            "subscription": { "read_only": False },
            "users": { "ignore_on_save": True },            
            "city": { "ignore_on_save": True },
            "subscription": { "ignore_on_save": True }
        }

    def on_create_and_update(self, instance, validated_data):
        city_dt = validated_data.get("city")
        if not city_dt == None:
            district, title = city_dt.split("/")
            city, created = City.objects.get_or_create(district = district, title = title)
            
            instance.city = city
            instance.save()

        users, ctus = validated_data.get("users"), []
        if not users == None:
            for user in users:
                ctu, created = CesspoolToUser.objects.get_or_create(
                    user = get_user_model().objects.get(email = user.get("user")), 
                    cesspool = instance,
                )
                ctu.is_super_owner = user.get("is_super_owner", False)
                ctu.save()

                ctus.append(ctu.pk)

            CesspoolToUser.objects.exclude(pk__in = ctus).delete()

        sub = validated_data.get("subscription", None)
        if sub != None:
            instance.subscription = Subscription.objects.get(title = sub)
            instance.save()