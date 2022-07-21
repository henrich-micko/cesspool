from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from . import models


class CreateUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UserAccount
        fields = ["email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, valited_data):
        password = valited_data.pop("password", None)
        new_user = self.Meta.model(**valited_data)
        if password is not None:
            new_user.set_password(password)
        new_user.save()
        return new_user


class BlacklistTokenSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        return token