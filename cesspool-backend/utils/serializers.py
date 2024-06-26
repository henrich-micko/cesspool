from rest_framework.serializers import ModelSerializer
from utils.utils import get_value_by_path


class MSWithListners(ModelSerializer):

    def on_create_and_update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        extra_kwargs = getattr(self.Meta, "extra_kwargs", {})

        validated_data_for_create = {
            k:v for k, v in validated_data.items() 
            if not get_value_by_path(extra_kwargs, f"{k}/ignore_on_save", False)
        }

        instance = super().create(validated_data = validated_data_for_create)
        self.on_create_and_update(instance = instance, validated_data = validated_data)
        return instance

    def update(self, instance, validated_data):
        extra_kwargs = getattr(self.Meta, "extra_kwargs", {})
        
        validated_data_for_update = {
            k:v for k, v in validated_data.items() 
            if not get_value_by_path(extra_kwargs, f"{k}/ignore_on_save", False)
        }

        update_ouptut = super().update(instance, validated_data_for_update)
        self.on_create_and_update(instance = instance, validated_data = validated_data)
        return update_ouptut