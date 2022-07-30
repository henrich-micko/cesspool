from rest_framework import serializers

from . import models


class MachineSerializer(serializers.ModelSerializer):
    level = serializers.SerializerMethodField(default = 0)
    battery = serializers.SerializerMethodField(default = 0)

    class Meta:
        model = models.Machine
        fields = ["id", "title", "level", "battery"]

    def get_level(self, obj):
        return obj.level

    def get_battery(self, obj):
        return obj.battery


class RecordSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Record
        fields = ["level", "battery", "date"]