from rest_framework.validators import ValidationError
from django.conf import settings

from account.models import UserAccount


def district_city_validation(value):
    splited = value.split("/")
    if len(splited) != 2: 
        raise ValidationError("Invalid format, should be district/city")    
    value_district, value_city = splited

    with open(settings.LOCATION_FILE, "r") as f:
        while True:
            location_line = f.readline().strip()
            if location_line == "":
                break

            district, city = location_line.split("/")
            if city == value_city and district == value_district: return

    raise ValidationError("This compination doesnt exists")

def manager_validation(value):
    print(value)
    try: UserAccount.objects.get(email = value)
    except UserAccount.DoesNotExist: raise ValidationError("User doesnt exists")
    return value