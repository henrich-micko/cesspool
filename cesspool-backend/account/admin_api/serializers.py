from rest_framework.serializers import ModelSerializer

from account import models

class UserAccountSerializer(ModelSerializer):
    
    class Meta:
        model = models.UserAccount
        fields = ["pk", "email", "is_staff", "is_active"]
        extra_kwargs = {"email": {"required": False}, "pk": {"read_only": True}}


class UserAccountCreateSerializer(ModelSerializer):

    class Meta:
        model = models.UserAccount
        fields = ["pk", "email", "is_staff"]
        extra_kwargs = {"email": {"required": True}, "pk": {"read_only": True}, "is_staff": {"default": False}}