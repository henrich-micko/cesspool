from rest_framework.serializers import ModelSerializer


class _ModelSerializer(ModelSerializer):

    def on_instance_modify(self, validated_data):
        pass

    def create(self, validated_data):
        validated_data_for_create = {
            k:v for k, v in validated_data.items() 
            if self.Meta.extra_kwargs.get(k, None) != None and not self.Meta.extra_kwargs[k].get("ignore_on_create", False)
        }

        super_create_ouptut = super().create(validated_data = validated_data_for_create)
        self.on_instance_change(validated_data = validated_data)
        
        return super_create_ouptut

    def update(self, instance, validated_data):
        self.on_instance_change(validated_data = validated_data)
        return super().update(instance, validated_data)