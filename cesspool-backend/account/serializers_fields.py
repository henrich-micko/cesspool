from rest_framework import serializers
from account.models import UserAccount


class PermissionField(serializers.ListField):
    def __init__(self, **kwargs):
        kwargs["child"] = serializers.CharField()
        super().__init__(**kwargs)

    def get_attribute(self, instance: UserAccount):
        permissions = [
            "cesspool.related_to_cesspool",
            "cesspool.manage_cesspool",
            "account.manage_account",
            "location.manage_city",
            "location.be_city_admin",
        ]

        return [
            p
            for p in permissions 
            if instance.has_perm(p)
        ]