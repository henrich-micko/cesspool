from django.db import models
from django.conf import settings

from . import managers


class Machine(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, null = True)
    
    title = models.CharField(max_length = 20)
    code = models.CharField(max_length = 10, unique = True)

    def __str__(self):
        return f"{self.code}"

    def get_level(self) -> int:
        return self.record_set.last().level

    def get_battery(self) -> int:
        return self.record_set.last().battery


class Record(models.Model):
    objects = models.Manager.from_queryset(managers.QuerySet)

    machine = models.ForeignKey(Machine, on_delete = models.CASCADE)  
    
    date = models.DateTimeField(auto_now_add = True)
    level = models.IntegerField(default = 0)
    battery = models.IntegerField(default = 0)

    def __str__(self):
        return f"{str(self.machine)} -> {self.date}"