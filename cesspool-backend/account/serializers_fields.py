from rest_framework import serializers
from django.conf import settings

from account.models import UserAccount



class PermissionField(serializers.ListField):
    def __init__(self, **kwargs):
        kwargs["child"] = serializers.CharField()
        super().__init__(**kwargs)

    def get_attribute(self, instance: UserAccount):
        return instance.get_permissions()
    

class GroupField(serializers.ListField):
    def __init__(self, **kwargs):
        kwargs["child"] = serializers.CharField()
        super().__init__(**kwargs)

    def get_attribute(self, instance):
        return instance.get_groups()