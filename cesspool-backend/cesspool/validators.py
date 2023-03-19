from django.core.exceptions import ValidationError


def validate_machine_code(value):
    special_char = ["/"]

    for char in special_char:
        if char in value:
            raise ValidationError(f"Field code can't contains char '{char}'", params = {"value": value})
        

def validate_cesspool_code_exists(value):
    from cesspool.models import Cesspool

    try: 
        Cesspool.objects.get(code = value)
    except Cesspool.DoesNotExist: 
        raise ValidationError(f"Cesspool with this code doesnt exists '{value}'", params = {"value": value})
