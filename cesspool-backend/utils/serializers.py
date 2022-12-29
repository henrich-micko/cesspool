from rest_framework.serializers import ModelSerializer
from utils.utils import get_value_by_path


class _ModelSerializer(ModelSerializer):

    def on_instance_modify(self, instance, validated_data):
        pass

    def create(self, validated_data):
        validated_data_for_create = {
            k:v for k, v in validated_data.items() 
            if not get_value_by_path(self.Meta.extra_kwargs, f"{k}/ignore_on_create", False)
        }

        instance = super().create(validated_data = validated_data_for_create)
        self.on_instance_modify(instance = instance, validated_data = validated_data)
        return instance

    def update(self, instance, validated_data):
        self.on_instance_modify(instance = instance, validated_data = validated_data)
        return super().update(instance, validated_data)