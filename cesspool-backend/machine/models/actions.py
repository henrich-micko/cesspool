from django.db import models

from . import machine as machine_models


class MachineBaseAction(models.Model):
    machine = models.OneToOneField(machine_models.Machine, on_delete = models.CASCADE)
    date = models.DateTimeField()

    class Meta:
        abstract = True
        
    def __str__(self):
        return f"{self.machine} at {self.date}"

    def run(self):
        pass

class MachineDeleteAction(MachineBaseAction):
    def run(self):
        self.machine.delete()

class MachineDeleteRecordsAction(MachineBaseAction):
    def run(self):
        self.machine.records.all().delete()