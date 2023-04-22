from django.shortcuts import get_object_or_404


def generate_cesspool_code():
    from cesspool.models import Cesspool
    from utils.utils import generate_code

    return generate_code(
        lenght = 8,
        invalid = [c.code for c in Cesspool.objects.all()]
    )

def try_get_cesspool_from_user_by_code(user, **kwargs):
    from cesspool.models import CesspoolToUser
    return get_object_or_404(CesspoolToUser.objects.all(), user = user, **kwargs).cesspool


def try_get_cesspool_by_code(**kwargs):
    from cesspool.models import Cesspool
    return get_object_or_404(Cesspool.objects.all(), **kwargs)


def battery_voltage_to_percent(value):
    return round(100 * value / 6, 2) # full battery