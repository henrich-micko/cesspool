from django.db import models
from django.conf import settings

from . import managers


class Machine(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, null = True)

    title = models.CharField(max_length = 20, default = "untitled")
    code = models.CharField(max_length = 10, unique = True)
    
    max_level = models.IntegerField(null = True, blank = True)

    def __str__(self):
        return f"{self.title}"

    @property
    def level(self) -> int:
        return self.record_set.last().level

    @property
    def battery(self) -> int:
        return self.record_set.last().battery

    def get_level_percent(self) -> float:
        if self.max_level == None:
            raise ValueError("max_level field is not deffined.")
        
        return (self.level/self.max_level)*100

    @property
    def status(self):
        level_percent = int(self.get_level_percent())
        if level_percent < 50: return 0
        if level_percent < 75: return 1
        if level_percent < 90: return 2
        return 3

class Record(models.Model):
    objects = managers.RecordQuerySet.as_manager()

    machine = models.ForeignKey(Machine, on_delete = models.CASCADE)

    date = models.DateTimeField(auto_now_add = True)
    level = models.IntegerField(default = 0)
    battery = models.IntegerField(default = 0)

    def __str__(self):
        return f"{str(self.machine)} -> {self.date}"
