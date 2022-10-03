from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from datetime import datetime

from .managers import UserAccountManager


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