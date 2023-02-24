from django.core.exceptions import ValidationError
from rest_framework import serializers

from cesspool.models import CesspoolToUser
from account.validators import validate_user_with_permissions
from subscription.validators import validate_subscription


class CesspoolUsersField(serializers.ListField):
    def __init__(self, **kwargs):
        kwargs["child"] = serializers.DictField()
        super().__init__(**kwargs)

        self.validators.append(
            CesspoolUsersField._validate
        )

    def get_attribute(self, instance):
        return [
            { "user": ctu.user.email, "is_super_owner": ctu.is_super_owner } 
            for ctu in CesspoolToUser.objects.filter(cesspool = instance)
        ]

    @staticmethod
    def _validate(value):
        if type(value) != list:
            raise ValidationError("Invalid format")

        for user_data in value:
            user, is_super_owner = user_data.get("user", None), user_data.get("is_super_owner", None)
            if user == None or is_super_owner == None:
                raise ValidationError("user or is_super_owner field is missing")

            validate_user_with_permissions("cesspool.relation_to_cesspool")(value = user)


class SubscriptionField(serializers.CharField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.validators.append(
            validate_subscription
        )

    def get_attribute(self, instance):
        return instance.subscription.title