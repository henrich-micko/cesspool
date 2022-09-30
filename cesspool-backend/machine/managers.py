from platform import machine
from random import randint, random, uniform
from typing import List
from django.db.models import QuerySet, Model, Manager
from django.utils import timezone

from datetime import timedelta


class MachineManager(Manager):
    def create_demo(self, **kwargs):
        timedelta_kwargs = {key.replace("time_", ""):kwargs[key] for key in kwargs.keys() if key.startswith("time_")}
        kwargs = dict(filter(lambda item: not item[0].startswith("time_"), kwargs.items()))

        timedelta_hour_step = timedelta_kwargs.pop("hour_step", 2)

        if timedelta_hour_step <= 0:
            raise ValueError("'time_hour_step' can't be less or equals to zero.")
        if not timedelta_kwargs:
            raise ValueError("There was not provided kwargs for timedelta: 'time_year'.")

        machine = self.create(**kwargs)
        machine_level, machine_level_percent, machine_battery = 0, 0, 100
        
        max_level = 250

        today_date = timezone.now()
        record_date = today_date - timedelta(**timedelta_kwargs)

        while (record_date < today_date):
            record = machine.record_set.create(level = machine_level, battery = machine_battery, level_percent = machine_level_percent)
            record.date = record_date
            record.save(update_fields = ["date"])
            
            if machine_level <= max_level: 
                machine_level += uniform(1/12, 3/12) # random
                machine_level_percent = round((machine_level/max_level)*100, 2)

            else: 
                machine_level = 0
            
            if machine_battery <= 100: machine_battery += 1
            else: machine_battery = 0
            
            record_date += timedelta(hours = timedelta_hour_step)
        
        return machine

    def create(self, **kwargs):
        if kwargs.get("title") != None:
            kwargs["title"] = kwargs["title"].capitalize()
        
        return super().create(**kwargs)

    def get_machine_code(self):   
        def machine_code_list_to_string(machine_code: List[int]):
            return "".join([str(i) for i in machine_code])

        def machine_code_exists(machine_code: str):
            return self.filter(code = machine_code).first() != None

        machine_code = [0]

        while machine_code_exists(machine_code_list_to_string(machine_code)):
            if machine_code[-1] != 9: 
                machine_code[-1] += 1
            else:
                machine_code.append(0)

        return machine_code_list_to_string(machine_code)

class RecordQuerySet(QuerySet):
    def get_level_average(self) -> int:
        output = 0
        for obj in self.all():
            output += obj.level
        return output/len(self.all())

    def get_level_percent_average(self) -> int:
        output = 0
        for obj in self.all():
            output += obj.level
        return output/len(self.all())

    def time_period(self, **kwargs) -> QuerySet[Model]:
        record = self.last()
        if record == None: return RecordQuerySet(self.model, using = self._db).none()

        since = record.date - timedelta(**kwargs)
        return self.filter(date__range = [since, record.date])

    def last_by(self, key) -> QuerySet[Model]:
        output_dict: dict = {}

        for record in self.all():
            key_value = key(item = record)

            if not key_value in output_dict.keys(): output_dict[key_value] = record
            else: output_dict[key_value] = record

        return self.filter(id__in = [record.id for record in output_dict.values()])

    def timedelta(self, default = None):
        records = self.order_by("-date")
        if len(records) >= 2:
            return records.first().date - records.last().date
        return default