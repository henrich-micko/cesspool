from random import uniform
from django.db.models import QuerySet, Model, Manager
from django.utils import timezone

from datetime import datetime, timedelta


class MachineManager(Manager):
    def create_demo(self, **kwargs):
        timedelta_kwargs = {key.replace("time_", ""):kwargs[key] for key in kwargs.keys() if key.startswith("time_")}
        kwargs = dict(filter(lambda item: not item[0].startswith("time_"), kwargs.items()))

        timedelta_hour_step = timedelta_kwargs.pop("hour_step", 2)

        if timedelta_hour_step <= 0:
            raise ValueError("'time_hour_step' can't be less or equals to zero.")
        if not timedelta_kwargs:
            raise ValueError("There was not provided kwargs for timedelta: 'time_year'.")

        if not "max_level" in kwargs.keys():
            kwargs["max_level"] = 250

        machine = self.create(**kwargs)
        machine_level, machine_battery = 0, 100
        
        today_date = timezone.now()
        record_date = today_date - timedelta(**timedelta_kwargs)

        while (record_date < today_date):
            record = machine.record_set.create(level = machine_level, battery = machine_battery)
            record.date = record_date
            record.save(update_fields = ["date"])
            
            if machine_level <= machine.max_level: machine_level += uniform(1/12, 3/12)
            else: machine_level = 0
            
            if machine_battery <= 100: machine_battery += 1
            else: machine_battery = 0
            
            record_date += timedelta(hours = timedelta_hour_step)
        
        return machine

    def create(self, **kwargs):
        if kwargs.get("title") != None:
            kwargs["title"] = kwargs["title"].capitalize()
        
        return super().create(**kwargs)

class RecordQuerySet(QuerySet):
    def get_level_average(self) -> int:
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