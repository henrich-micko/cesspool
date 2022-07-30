from django.db import models
from django.conf import settings

from . import managers


class Machine(models.Model):
    objects = managers.MachineManager()

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, null = True)
    title = models.CharField(max_length = 20)
    code = models.CharField(max_length = 10, unique = True)

    def __str__(self):
        return f"{str(self.user)} -> {self.title}"

    def get_level(self):
        return self.machinerecord_set.last().level

    def get_battery(self):
        return self.machinerecord_set.last().battery


class Record(models.Model):
    machine = models.ForeignKey(Machine, on_delete = models.CASCADE)  
    date = models.DateTimeField(auto_now_add = True)
    level = models.IntegerField(default = 0)
    battery = models.IntegerField(default = 0)

    def __str__(self):
        return f"{str(self.machine)} -> {self.date}"