from django.db import models
from django.conf import settings
from utils.models import ModelWithDeleteField
import csv


class City(ModelWithDeleteField):
    manager = models.ForeignKey("account.UserAccount", on_delete = models.CASCADE, null = True)
    
    title = models.CharField(max_length = 25)
    district = models.CharField(max_length = 25)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.SET_NULL, null = True, related_name = "created_city")

    class Meta:
        unique_together = ["title", "district"]
        permissions = [
            ["export_data", "Can export data"],
            ["be_city_admin", "Can be an admin of city"],
            ["manage_city", "Can manage cities"]
        ]

    def __str__(self):
        return f"{self.district}/{self.title}"

    def write_csv(self, writable):        
        fieldnames = ["Žumpa", "Datum", "Vlastník"]
    
        writer = csv.DictWriter(writable, fieldnames = fieldnames)
        writer.writeheader()

        for cesspool in self.cesspool_set.all():
            cesspool_release_dates = cesspool.record_set.get_release_datetimes()

            for release in cesspool_release_dates:
                writer.writerow({
                    "Žumpa": cesspool.code,
                    "Datum": release.strftime("%y-%d-%m"),
                    "Vlastník": cesspool.get_owner() 
                })
    
        return writable