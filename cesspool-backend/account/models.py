from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from account.managers import UserAccountManager
from account.utils import generate_activate_user_code, generate_reset_password_code
from utils.models import ModelWithDeleteField
from utils.utils import get_default_datetime_timedelta



class UserAccount(AbstractBaseUser, PermissionsMixin, ModelWithDeleteField):
    objects = UserAccountManager()

    email = models.EmailField(unique = True)
    is_staff = models.BooleanField(default = False)
    is_active = models.BooleanField(default = True)
    date_joined = models.DateTimeField(default = timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    

def _rpt_expired_date_default():
    return timezone.now() + timezone.timedelta(minutes = 15)

class ResetPasswordToken(models.Model):
    token = models.CharField(max_length = 10, default = generate_reset_password_code)
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    expired_date = models.DateTimeField(
        default = _rpt_expired_date_default
    )

    def __str__(self):
        return self.token


def _aut_expired_date_default():
    return timezone.now() + timezone.timedelta(days = 7)
    
class ActivateUserToken(models.Model):
    token = models.CharField(max_length = 10, default = generate_activate_user_code)
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    expired_date = models.DateTimeField(
        default = _aut_expired_date_default
    )

    def __str__(self):
        return self.token