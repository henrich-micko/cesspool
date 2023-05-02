from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import Group

from account.managers import UserAccountManager
from account.utils import generate_activate_user_code, generate_reset_password_code
from utils.models import ModelWithDeleteField


class UserAccount(AbstractBaseUser, PermissionsMixin, ModelWithDeleteField):
    objects = UserAccountManager()

    email = models.EmailField(unique = True)
    is_staff = models.BooleanField(default = False)
    is_active = models.BooleanField(default = False)
    date_joined = models.DateTimeField(default = timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        permissions = [
            ["manage_account", "Can manage accounts"]
        ]

    created_by = models.ForeignKey(
        "account.UserAccount", 
        on_delete = models.SET_DEFAULT,
        default = None, 
        null = True, 
        blank = True
    )

    def __str__(self):
        return self.email
    
    def get_groups(self):
        return self.groups.all()
    
    def has_group(self, group_name):
        try: Group.objects.get(user = self, name = group_name)
        except Group.DoesNotExist: return False
        return True
    
    def get_permissions(self):
        permissions = [
            "cesspool.related_to_cesspool",
            "cesspool.manage_cesspool",
            "account.manage_account",
            "location.manage_city",
            "location.be_city_admin",
        ]

        return [
            p for p in permissions if self.has_perm(p)
        ]


def _rpt_expired_date_default():
    return timezone.now() + timezone.timedelta(minutes = 15)


class ResetPasswordToken(models.Model):
    token = models.CharField(max_length = 10, default = generate_reset_password_code)
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    expired_date = models.DateTimeField(default = _rpt_expired_date_default)

    def __str__(self):
        return self.token



def _aut_expired_date_default():
    return timezone.now() + timezone.timedelta(days = 7)


class ActivateUserToken(models.Model):
    token = models.CharField(max_length = 10, default = generate_activate_user_code)
    user = models.OneToOneField(UserAccount, on_delete = models.CASCADE)
    expired_date = models.DateTimeField(default = _aut_expired_date_default)

    def __str__(self):
        return self.token