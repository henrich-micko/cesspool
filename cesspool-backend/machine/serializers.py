from rest_framework import serializers
from traitlets import default

from . import models


class MachineSerializer(serializers.ModelSerializer):
    level = serializers.SerializerMethodField(default = 0)
    level_percent = serializers.SerializerMethodField(default = None)
    battery = serializers.SerializerMethodField(default = 0)
    status = serializers.SerializerMethodField(default = None)

    class Meta:
        model = models.Machine
        fields = ["id", "title", "level", "battery"]

    def get_level(self, obj):
        return obj.level

    def get_level_percent(self, obj):
        if obj.max_level != None:
            return obj.get_level_percent()
        return None

    def get_battery(self, obj: models.Machine):
        return obj.battery

    def get_problems(self, obj: models.Machine):
        problems_list = sorted(obj.problem_scan(), key = lambda item: item[0], reverse = True)
        problems_dict = [models.Status.to_json(item) for item in problems_list]
        return problems_dict

    def get_last_update(self, obj: models.Machine):
        return obj.last_update


class RecordSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Record
        fields = ["level", "battery", "date"]