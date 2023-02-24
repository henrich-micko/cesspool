from django.db import models
from subscription.validators import validate_max_owners


class Subscription(models.Model):
 
    title = models.CharField(max_length = 10, unique = True)
    about = models.CharField(max_length = 50)

    mqtt = models.BooleanField(default = False)
    email_notf = models.BooleanField(default = False)
    sms_notf = models.BooleanField(default = False)
    max_owners = models.IntegerField(default = 1, validators = [validate_max_owners])

    def __str__(self):
        return self.title