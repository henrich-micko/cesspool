from django.db import models

# Create your models here.

class City(models.Model):
    manager = models.ForeignKey("account.UserAccount", on_delete = models.CASCADE, null = True)
    
    title = models.CharField(max_length = 25)
    district = models.CharField(max_length = 25)

    class Meta:
        unique_together = ["title", "district"]
        permissions = [
        ]

    def __str__(self):
        return f"{self.district}/{self.title}"