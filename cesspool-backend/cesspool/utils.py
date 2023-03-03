from django.shortcuts import get_object_or_404


def generate_cesspool_code():
    from cesspool.models import Cesspool
    from utils.utils import generate_code
    
    return generate_code(
        lenght = 8,
        invalid = [c.code for c in Cesspool.objects.all()] 
    )

def try_get_cesspool_by_code(user, cesspool_code):
    from cesspool.models import CesspoolToUser

    return get_object_or_404(CesspoolToUser.objects.all(), user = user, cesspool__code = cesspool_code).cesspool