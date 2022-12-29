from django.db import models
from utils.models import ModelWithDeleteField

# Create your models here.

class City(ModelWithDeleteField):
    manager = models.ForeignKey("account.UserAccount", on_delete = models.CASCADE, null = True)
    
    title = models.CharField(max_length = 25)
    district = models.CharField(max_length = 25)

    class Meta:
        unique_together = ["title", "district"]

    def __str__(self):
        return f"{self.district}/{self.title}"