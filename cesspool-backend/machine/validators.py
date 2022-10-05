from django.core.exceptions import ValidationError


def validate_machine_code(value):
    special_char = ["/"]

    for char in special_char:
        if char in value:
            raise ValidationError(f"Field code can't contains char '{char}'", params = {"value": value})
