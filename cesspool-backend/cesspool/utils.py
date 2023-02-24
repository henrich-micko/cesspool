def generate_cesspool_code():
    from cesspool.models import Cesspool
    from utils.utils import generate_code
    
    return generate_code(
        lenght = 8,
        invalid = [c.code for c in Cesspool.objects.all()] 
    )