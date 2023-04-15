from rest_framework.validators import ValidationError
from django.conf import settings

from json import load
from account.models import UserAccount


def district_city_validation(value):
    splited = value.split("/")
    if len(splited) != 2: 
        raise ValidationError("Invalid format, should be district/city")    
    value_district, value_city = splited
    with open(settings.LOCATION_FILE, "r") as f:
        data: dict = load(f)
    if data.get(value_district, False) and value_city in data[value_district]:
        return
    raise ValidationError("This location compination doesnt exists")

def manager_validation(value):
    if value == None: return value
    
    try: user = UserAccount.objects.get(email = value)
    except UserAccount.DoesNotExist: raise ValidationError("User doesnt exists")

    if not user.has_perm("location.be_city_admin"):
        raise ValidationError("User doesnt have permission to be admin")

    return value