from rest_framework import serializers
from machine import models

class MachineDetialForAdminSerializer(serializers.ModelSerializer):
    
    users = serializers.SerializerMethodField()
    delete_date = serializers.SerializerMethodField()
    delete_records_date = serializers.SerializerMethodField()
    records = serializers.SerializerMethodField()
    last_update = serializers.SerializerMethodField()
    problems = serializers.SerializerMethodField()

    class Meta:
        model = models.Machine
        fields = [
            "users",
            "code", 
            "mqtt", 
            "notification", 
            "delete_date", 
            "delete_records_date",
            "records",
            "last_update",
            "problems",
        ]
        extra_kwargs = {"code": {"required": False}}

    def get_users(self, obj):
        return [mtu.user.email for mtu in obj.machinetouser_set.all()]

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

    def validate(self, attrs):
        print(attrs)
        return super().validate(attrs)

    def create(self, validated_data):
        if not "code" in validated_data.keys():
            validated_data["code"] = models.Machine.objects.get_machine_code()

        return super().create(validated_data)