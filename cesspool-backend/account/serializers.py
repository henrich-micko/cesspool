from django.utils import timezone
from rest_framework import serializers

from . import models


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
    delete_date = serializers.SerializerMethodField(default = None)
    delete_machines_date = serializers.SerializerMethodField(default = None)

    class Meta:
        model = models.UserAccount
        fields = ["pk", "email", "is_active", "date_joined", "is_staff", "delete_date", "delete_machines_date"]
        extra_kwargs = {"email": {"required": False}}

    def get_delete_date(self, obj):
        action = obj.one_to_one(models.AccountDeleteAction)
        if action != None:
            return action.date
        return None

    def get_delete_machines_date(self, obj):
        action = obj.one_to_one(models.AccountDeleteMachinesAction)
        if action != None:
            return action.date
        return None

class ResetPasswordSerializer(serializers.Serializer):
    user = serializers.EmailField(default = None)

    class Meta:
        fields = ["user"]

    def validate_user(self, user):
        if models.UserAccount.objects.filter(email = user).first() == None:
            raise serializers.ValidationError("User doesn't exists.")
        return user

class ResetPasswordSubmitSerializer(serializers.Serializer):
    token = serializers.CharField(max_length = 10)
    password = serializers.CharField(max_length = 10)

    class Meta:
        fields = ["token", "password"]

    def validate_token(self, token):
        token_obj = models.ResetPasswordToken.objects.filter(token = token).first()
        if token_obj == None or token_obj.expired_date < timezone.now():
            raise serializers.ValidationError("Token not found or expired.")
        
        return token

class ResetPasswordTokenSerializer(serializers.Serializer):
    token = serializers.CharField(max_length = 10)

    class Meta:
        fields = ["token"]

    def validate_token(self, token):
        token_obj = models.ResetPasswordToken.objects.filter(token = token).first()
        if token_obj == None or token_obj.expired_date < timezone.now():
            raise serializers.ValidationError("Token not found or expired.")
        
        return token
# 
class ActivateUserSerializer(serializers.Serializer):
    token = serializers.CharField(max_length = 10)
    password = serializers.CharField(max_length = 10)

    class Meta:
        fields = ["token", "password"]

    def validate_token(self, token):
        token_obj = models.ActivateUserToken.objects.filter(token = token).first()
        if token_obj == None or token_obj.expired_date < timezone.now():
            raise serializers.ValidationError("Token not found or expired.")
        
        return token

class ActivateUserCheckTokenSerializer(serializers.Serializer):
    token = serializers.CharField(max_length = 10)

    class Meta:
        fields = ["token"]

    def validate_token(self, token):
        token_obj = models.ActivateUserToken.objects.filter(token = token).first()
        if token_obj == None or token_obj.expired_date < timezone.now():
            raise serializers.ValidationError("Token not found or expired.")
        
        return token
