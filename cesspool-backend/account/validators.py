from django.core.exceptions import ValidationError
from utils.utils import get_user_model, is_history


def validate_user(value):
    account_model = get_user_model()
    try: account_model.objects.get(email = value)
    except account_model.DoesNotExist: raise ValidationError("User doesnt exists")

    return value


def validate_user_with_permissions(*permissions):
    
    def validation(value):
        account_model = get_user_model()
        try: user = account_model.objects.get(email = value)
        except account_model.DoesNotExist: raise ValidationError("User doesnt exists")

        for perm in permissions:
            if not user.has_perm(perm):
                raise ValidationError(f"User doesnt has permission to {perm}")

        return value

    return validation


def validate_reset_password_token(value):
    from account.models import ResetPasswordToken
    try: token = ResetPasswordToken.objects.get(token = value)
    except ResetPasswordToken.DoesNotExist: raise ValidationError("Token doesnt exists")
    if is_history(token.expired_date): raise ValidationError("Token is expired")


def validate_activate_account_token(value):
    from account.models import ActivateUserToken
    try: token = ActivateUserToken.objects.get(token = value)
    except ActivateUserToken.DoesNotExist: raise ValidationError("Token doesnt exists")
    if is_history(token.expired_date): raise ValidationError("Token is expired")