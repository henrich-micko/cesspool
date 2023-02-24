def generate_reset_password_code():
    from account.models import UserAccount
    from utils.utils import generate_code
    
    return generate_code(
        lenght = 10,
        invalid = [c.code for c in UserAccount.objects.all()] 
    )


def generate_activate_user_code():
    from account.models import UserAccount
    from utils.utils import generate_code
    
    return generate_code(
        lenght = 10,
        invalid = [c.code for c in UserAccount.objects.all()] 
    )