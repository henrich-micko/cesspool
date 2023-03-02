def generate_reset_password_code():
    from account.models import ResetPasswordToken
    from utils.utils import generate_code
    
    return generate_code(
        lenght = 10,
        invalid = [c.token for c in ResetPasswordToken.objects.all()] 
    )


def generate_activate_user_code():
    from account.models import ActivateUserToken
    from utils.utils import generate_code
    
    return generate_code(
        lenght = 10,
        invalid = [c.token for c in ActivateUserToken.objects.all()] 
    )