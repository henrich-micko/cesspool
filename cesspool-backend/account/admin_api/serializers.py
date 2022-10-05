from rest_framework.serializers import ModelSerializer, SerializerMethodField

from account import models

class UserAccountSerializer(ModelSerializer):
    delete_date = SerializerMethodField(default = None)
    delete_machines_date = SerializerMethodField(default = None)
    
    class Meta:
        model = models.UserAccount
        fields = ["pk", "email", "is_staff", "is_active", "delete_date", "delete_machines_date", "date_joined"]
        extra_kwargs = {"email": {"required": False}, "pk": {"read_only": True}}

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


class UserAccountCreateSerializer(ModelSerializer):

    class Meta:
        model = models.UserAccount
        fields = ["pk", "email", "is_staff"]
        extra_kwargs = {"email": {"required": True}, "pk": {"read_only": True}, "is_staff": {"default": False}}