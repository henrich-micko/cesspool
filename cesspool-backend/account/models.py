from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from datetime import datetime, timedelta

from .managers import UserAccountManager

import random, string

def generate_code(lenght: int = 10, check = None):
    while True:
        output = ""

        for i in range(lenght):
            new_char = random.choice(string.ascii_letters)
            if random.randint(0, 1):
                new_char = new_char.upper()
            output += new_char
    
        if check == None or check(token = output):
            break

    return output

class UserAccount(AbstractBaseUser, PermissionsMixin):
    objects = UserAccountManager()

    email = models.EmailField(unique = True)

    is_staff = models.BooleanField(default = False)
    is_active = models.BooleanField(default = True)

    date_joined = models.DateTimeField(default = timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def action_at(self, action: models.Model, date: datetime):
        action = action.objects.update_or_create(user = self, defaults = {"date": date})
        return action

    def one_to_one(self, table: models.Model, default = None):
        output = table.objects.filter(user = self).first()
        if output != None:
            return output
        return default

class AccountBaseAction(models.Model):
    user = models.OneToOneField(UserAccount, on_delete = models.CASCADE)
    date = models.DateTimeField()

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.user} at {self.date}"

    def run(self):
        pass

class AccountDeleteAction(AccountBaseAction):
    def run(self):
        self.user.delete()

class AccountDeleteMachinesAction(AccountBaseAction):
    def run(self):
        self.user.machine_set.all().delete()

class TokenForUser(models.Model):
    user = models.OneToOneField(UserAccount, on_delete = models.CASCADE)
    token = models.CharField(max_length = 8, default = generate_code)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.token} for {self.user}"

def get_reset_password_token_date():
    return timezone.now() + timedelta(minutes = 5)

class ResetPasswordToken(TokenForUser):
    expired_date = models.DateTimeField(default = get_reset_password_token_date)

def get_activate_user_token_date():
    return timezone.now() + timedelta(days = 14)

class ActivateUserToken(TokenForUser):
    expired_date = models.DateTimeField(default = get_activate_user_token_date)

def get():
    return