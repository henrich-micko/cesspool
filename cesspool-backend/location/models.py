from django.db import models

from utils.models import ModelWithDeleteField
import csv


class City(ModelWithDeleteField):
    manager = models.ForeignKey("account.UserAccount", on_delete = models.CASCADE, null = True)
    
    title = models.CharField(max_length = 25)
    district = models.CharField(max_length = 25)

    class Meta:
        unique_together = ["title", "district"]
        permissions = [
            ["export_data", "Can export data"],
            ["be_city_admin", "Can be an admin of city"]
        ]

    def __str__(self):
        return f"{self.district}/{self.title}"

    def write_csv(self, writable: any, month: int):        
        data = {
            machine: machine.record_set.filter(date__month = month).last_by(
                lambda item: item.date.strftime("%Y-%m-%d")
            )

            for machine in self.machine_set.all()
        }

        
        fieldnames = ["Zariadenie", "Datum", "Vlastnik", "Hladina"]
    
        writer = csv.DictWriter(writable, fieldnames = fieldnames)
        writer.writeheader()
        
        for machine, records in data.items():
            for record in records:
                writer.writerow({
                    "Datum": record.date.strftime("%Y-%d-%m"),
                    "Zariadenie": machine.code,
                    "Vlastnik": "Nik",
                    "Hladina": record.level
                })
    
        return writable