from rest_framework import serializers
from cesspool.models import Record


class RecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Record
        fields = [
            "pk",
            "level_m",
            "level_percent",
            "battery",
            "date",
            "created_on_debug_mode",
            "mqtt_message"
        ]