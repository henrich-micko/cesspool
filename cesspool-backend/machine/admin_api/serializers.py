from email.policy import default
from typing import OrderedDict
from rest_framework import serializers
from machine import models

import account

class AdminMachineDetailSerializer(serializers.ModelSerializer):
    user = serializers.EmailField(source = "user.email", default = None, allow_null = True)
    delete_date = serializers.SerializerMethodField()
    delete_records_date = serializers.SerializerMethodField()
    records = serializers.SerializerMethodField(default = 0)
    last_update = serializers.SerializerMethodField(default = None)
    problems = serializers.SerializerMethodField(default = None)

    class Meta:
        model = models.Machine
        fields = [
            "user",
            "code", 
            "mqtt", 
            "notification", 
            "delete_date", 
            "delete_records_date",
            "records",
            "last_update",
            "problems",
            "title",
        ]
        extra_kwargs = {"code": {"required": False}}

    def get_delete_date(self, obj):
        action = obj.one_to_one(models.MachineDeleteAction)
        if action != None:
            return action.date
        return None

    def get_delete_records_date(self, obj):
        action = obj.one_to_one(models.MachineDeleteRecordsAction)
        if action != None:
            return action.date
        return None

    def get_last_update(self, obj: models.Machine):
        return obj.last_update

    def get_problems(self, obj: models.Machine):
        problems = models.scan_problems(obj)

        return [
            {"detail": problem.detail, "importance": problem.importance}
            for problem in problems
        ]

    def get_records(self, obj):
        return len(obj.record_set.all())

    def validate(self, attrs: OrderedDict):
        if "user" in attrs.keys():
            if "user" not in self.initial_data.keys():
                del attrs["user"]

            else:
                email = attrs["user"]["email"]
                if email == None:
                    attrs["user"] = None        
                elif email:
                    user = account.models.UserAccount.objects.filter(email = email).first()
                    if user == None:
                        raise serializers.ValidationError({"user": "User doesn't exists"})
                    attrs["user"] = user

        return super().validate(attrs)

    def create(self, validated_data):
        if not "code" in validated_data.keys():
            validated_data["code"] = models.Machine.objects.get_machine_code()

        return super().create(validated_data)