from rest_framework import serializers
from machine import models


class AdminMachineDetailSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(default = None)

    class Meta:
        model = models.Machine
        fields = ["user", "code"]

    def get_user(self, obj):
        if obj.user != None:
            return obj.user.email
        return None