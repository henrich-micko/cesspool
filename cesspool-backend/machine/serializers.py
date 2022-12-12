from rest_framework import serializers

from . import models


class MachineSerializer(serializers.ModelSerializer):
    level = serializers.SerializerMethodField(default = 0)
    level_percent = serializers.SerializerMethodField(default = None)
    battery = serializers.SerializerMethodField(default = 0)
    problems = serializers.SerializerMethodField(default = None)
    last_update = serializers.SerializerMethodField(default = None)

    title = serializers.SerializerMethodField(default = None)
    hight_level = serializers.SerializerMethodField(default = 0)

    def __init__(self, user = None, instance = None, **kwargs):
        super().__init__(instance, **kwargs)

        self.user = user

    class Meta:
        model = models.Machine
        fields = [
            "id",
            "level",
            "code",
            "battery", 
            "problems",
            "level_percent", 
            "last_update",
            "title",
            "hight_level"
        ]

        extra_kwargs = {
            "id": {"read_only": True}, 
            "code": {"read_only": True}
        }

    def get_title(self, obj: models.Machine):
        mtu = models.MachineToUser.objects.filter(user = self.user, machine = obj).first()
        if mtu == None:
            return None
        return mtu.title

    def get_hight_level(self, obj: models.Machine):
        mtu = models.MachineToUser.objects.filter(user = self.user, machine = obj).first()
        if mtu == None:
            return None
        return mtu.hight_level

    def get_level(self, obj: models.Machine):
        return obj.level

    def get_level_percent(self, obj: models.Machine):
        return obj.level_percent

    def get_battery(self, obj: models.Machine):
        return obj.battery

    def get_problems(self, obj: models.Machine):
        problems = models.scan_problems(obj)

        return [
            {"detail": problem.detail, "importance": problem.importance}
            for problem in problems
        ]

    def get_last_update(self, obj: models.Machine):
        return obj.last_update

class MachineToUser(serializers.ModelSerializer):
    
    class Meta:
        model = models.MachineToUser
        fields = [
            "id",
            "title",
            "hight_level"
        ]

class RecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Record
        fields = [
            "id",
            "level", 
            "battery", 
            "level_percent", 
            "date", 
        ]