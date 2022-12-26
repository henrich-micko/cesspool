from rest_framework.validators import ValidationError
from django.conf import settings
from location.parser import load_from_file

def city_validation(value):
    location_file = f"location/data/{settings.LOCATION_FILE}"
    
    try: district, city = value.split("/")
    except ValueError: raise ValidationError("Invalid format <DISTRICT>/<CITY>") 

    locations = load_from_file(location_file)
    exists = [city, district] in locations

    if not exists:
        raise ValidationError("City in this Distric doesnt exists")

    return value