from django.db import models

# Create your models here.

class Location(models.Model):
    manager = models.ForeignKey("account.UserAccount", on_delete = models.CASCADE)