from rest_framework import serializers
from rest_framework.validators import ValidationError
from location import validators

class CityField(serializers.CharField):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.validators.append(validators.city_validation)