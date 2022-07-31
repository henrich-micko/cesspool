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

    def get_battery(self, obj):
        return obj.level

    def get_status(self, obj):
        if obj.max_level != None:
            return obj.status
        return None


class RecordSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Record
        fields = ["level", "battery", "date"]