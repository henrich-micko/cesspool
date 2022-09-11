from email.policy import default
from rest_framework import serializers
from machine import models

import account

class AdminMachineDetailSerializer(serializers.ModelSerializer):
    user = serializers.EmailField(source = "user.email", default = None, allow_null = True)
    delete_date = serializers.SerializerMethodField()
    delete_records_date = serializers.SerializerMethodField()
    records = serializers.SerializerMethodField(default = 0)

    class Meta:
        model = models.Machine
        fields = [
            "user",
            "code", 
            "mqtt", 
            "notification", 
            "autocorrect", 
            "delete_date", 
            "delete_records_date",
            "records"    
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

    def get_records(self, obj):
        return len(obj.record_set.all())

    def update(self, instance, validated_data):
        for key in validated_data.keys():
            if key == "user":
                if "user" not in self.initial_data.keys(): # if None is not default value (default value must be None because of frontend)
                    continue

                email = validated_data[key]["email"]
                if email == None:
                    instance.user = None
                elif email:
                    instance.user = account.models.UserAccount.objects.get(email = email)
            else:
                setattr(instance, key, validated_data[key])
            
            instance.save()
        return instance