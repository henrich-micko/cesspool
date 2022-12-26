from django.db import models

# Create your models here.

class City(models.Model):
    admin_manager = models.ForeignKey("account.UserAccount", on_delete = models.CASCADE, null = True)
    
    title = models.CharField(max_length = 25)
    district = models.CharField(max_length = 25)

    def __str__(self):
        return self.title