from email.policy import default
from platform import machine
import string
from tkinter.tix import Tree
from xmlrpc.client import boolean
from django.db import models
from django.conf import settings
from django.utils import timezone

from datetime import date, datetime, timedelta

from . import managers


class Status:
    """
    Status for problem scan level: int message:string
    """
    
    NO_USER = [0, "Nenašiel sa použivatel"]
    NO_RECORDS = [0, "Nenašiel sa žiaden záznam"]
    NO_TITLE = [0, "Nie je nastavené meno"]
    HIGHT_LEVEL = [1, "Vysoka hladina obsahu"]
    LOW_BATTERY = [1, "Takmer vybitá bateria"]
    OLD_RECORD = [1, "V dlhsej dobe nebol poskytnutý záznam"]

    @staticmethod
    def get(status: str, default = None) -> list[int, str]:
        return getattr(Status, status, default)

    @staticmethod
    def to_json(status: str|list[int, str]) -> dict:
        status = Status.get(status) if type(status) == str else status
        return None if status == None else {
            "importance": status[0],
            "detail": status[1]
        }
        

class Machine(models.Model):
    objects = managers.MachineManager()

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, null = True)
    title = models.CharField(max_length = 20, null = True, blank = True)
    code = models.CharField(max_length = 10, unique = True)
    
    mqtt = models.BooleanField(default = True)
    notification = models.BooleanField(default = True)
    autocorrect = models.BooleanField(default = True)

    def __str__(self) -> str:
        return self.code

    def get_record(self):
        return self.record_set.last()
    
    @property
    def level(self) -> int|None:
        record = self.get_record()
        return record.level if record != None else None

    @property
    def level_percent(self) -> int|None:
        record = self.get_record()
        return record.level_percent if record != None else None 

    @property
    def battery(self) -> int|None:
        record = self.get_record()
        return record.battery if record != None else None
    
    @property
    def last_update(self) -> datetime|None:
        record = self.get_record()
        return record.date if record != None else None 

    def problem_scan(self) -> list[list[int, str]]:
        output: list = []

        if self.user == None: output.append(Status.NO_USER)
        if self.title == None: output.append(Status.NO_TITLE)
        if self.get_record() == None: output.append(Status.NO_RECORDS)
        else:
            if self.level_percent >= 80: output.append(Status.HIGHT_LEVEL)
            if self.battery <= 10: output.append(Status.LOW_BATTERY)
            if self.last_update <= timezone.now() - timedelta(days = 2): output.append(Status.OLD_RECORD)

        return output
        
    def release_date(self):
        records = self.record_set.all().time_period(days = 1)
        if len(records) < 2: return

        first_record, last_record = records.first(), records.last()
        percent_rise = last_record.rise_percent(first_record)
        
        if percent_rise <= 0:
            new_records = []
            for record in records:
                if record.rise() <= 0: break
                new_records.append(record)
            if len(new_records) < 2: return

            first_record, last_record = new_records[0], new_records[-1]
            percent_rise = last_record.rise_percent(first_record)

        time = last_record.date - first_record.date
        level_percent = last_record.level
        output = last_record.date

        while level_percent < 85:
            level_percent += percent_rise
            try: output += time
            except OverflowError: break

        return date(year = output.year, month = output.month, day = output.day)

    def action_at(self, action: models.Model, date: datetime):
        action = action.objects.update_or_create(machine = self, defaults = {"date": date})
        return action

    def get_action(self, action: models.Model, default = None):
        output = action.objects.filter(machine = self).first()
        if output != None:
            return output
        return default

class MachineAction(models.Model):
    machine = models.OneToOneField(Machine, on_delete = models.CASCADE)
    date = models.DateTimeField()

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.machine} at {self.date}"

    def run(self):
        pass


class MachineDeleteAction(MachineAction):
    def run(self):
        self.machine.delete()


class MachineDeleteRecordsAction(MachineAction):
    def run(self):
        self.machine.records.all().delete()


class Record(models.Model):
    objects = managers.RecordQuerySet.as_manager()

    machine = models.ForeignKey(Machine, on_delete = models.CASCADE)
    date = models.DateTimeField(auto_now_add = True)
    level = models.FloatField(default = 0.0)
    level_percent = models.FloatField(default = 0.0)
    battery = models.FloatField(default = 0.0)

    def __str__(self) -> str:
        return f"{str(self.machine)} -> {self.date}: {self.level_percent}"

    def index(self, index: int, default: any = None):
        records_list = list(self.machine.record_set.all()) 
        center_index = records_list.index(self)
        index = center_index + index

        if len(records_list) - 1 >= index: 
            return records_list[index]
        return default

    def rise(self, record = None) -> int|None:
        before_record = record if record != None else self.index(-1)
        return self.level - before_record.level if before_record != None else None

    def rise_percent(self, record = None):
        before_record = record if record != None else self.index(-1)
        return self.level_percent - before_record.level_percent if before_record != None else None

    def is_valid(self, minimal_rise: int = 40) -> None|boolean:
        record_after = self.index(1)
        record_after_rise_percent = record_after.rise_percent() if record_after != None else None
        if record_after_rise_percent == None:
            return None

        rise_percent = self.rise_percent()
        if rise_percent == None:
            return None

        return not (rise_percent >= minimal_rise and record_after_rise_percent <= -minimal_rise + 10)