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