from rest_framework import serializers

from . import models


class MachineSerializer(serializers.ModelSerializer):
    level = serializers.SerializerMethodField(default = 0)
    level_percent = serializers.SerializerMethodField(default = None)
    battery = serializers.SerializerMethodField(default = 0)
    problems = serializers.SerializerMethodField(default = None)
    last_update = serializers.SerializerMethodField(default = None)

    class Meta:
        model = models.Machine
        fields = [
            "id",
            "title", 
            "level",
            "code",
            "battery", 
            "problems",
            "level_percent", 
            "last_update",
        ]

    def get_level(self, obj: models.Machine):
        return obj.level

    def get_level_percent(self, obj: models.Machine):
        return obj.level_percent

    def get_battery(self, obj: models.Machine):
        return obj.battery

    def get_problems(self, obj: models.Machine):
        problems_list = sorted(obj.problem_scan(), key = lambda item: item[0], reverse = True)
        problems_dict = [models.Status.to_json(item) for item in problems_list]
        return problems_dict

    def get_last_update(self, obj: models.Machine):
        return obj.last_update


class MachineConfSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Machine
        fields = ["title"]


class RecordSerializer(serializers.ModelSerializer):
    level_percent = serializers.SerializerMethodField(default = None)

    class Meta:
        model = models.Record
        fields = ["level", "battery", "level_percent", "date", "id"]

    def get_level_percent(self, obj):
        return obj.level_percent