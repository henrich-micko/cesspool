from rest_framework import serializers
from account import models, validators


class CreateUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UserAccount
        fields = ["email", "password", "pk"]
        extra_kwargs = {"password": {"write_only": True}, "pk": {"read_only": True}}

    def create(self, valited_data):
        return self.Meta.model.objects.create_user(**valited_data)

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password is too wick.")
        return value


class UserAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UserAccount
        fields = [
            "pk", 
            "email", 
            "is_active", 
            "date_joined", 
            "is_staff", 
            "delete_at",
        ]
        extra_kwargs = {
            "date_joined": { "read_only": True },
            "is_active": { "read_only": True },
            "is_staff": { "read_only": True },
            "delete_at": { "read_only": True },
        }


class ResetPasswordSerializer(serializers.Serializer):
    user = serializers.EmailField(
        default = None, 
        validators = [validators.validate_user]
    )

    class Meta:
        fields = [
            "user"
        ]

class ResetPasswordSubmitSerializer(serializers.Serializer):
    token = serializers.CharField(max_length = 10, validators = [validators.validate_reset_password_token])
    password = serializers.CharField(max_length = 10)

    class Meta:
        fields = [
            "token", 
            "password"
        ]


class ActivateUserSerializer(serializers.Serializer):
    token = serializers.CharField(max_length = 10, validators = [validators.validate_activate_account_token])
    password = serializers.CharField(max_length = 10)

    class Meta:
        fields = [
            "token", 
            "password"
        ]