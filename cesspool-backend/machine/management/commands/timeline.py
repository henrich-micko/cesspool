from django.core.management.base import BaseCommand, CommandParser
from django.utils import timezone

from machine import models
from datetime import timedelta

class Command(BaseCommand):
    help = "Create Records of time for spec time machine"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("--machine-code", type = int, required = True)
        parser.add_argument("--days", default = 0, type = int)

    def handle(self, *argv, **kwargs):
        machine = models.Machine.objects.get(code = kwargs["machine_code"])
        
        level, battery = 0, 100

        till_date = timezone.now()
        date = till_date - timedelta(
            days = kwargs["days"]
        )

        while (date < till_date):
            record = machine.record_set.create(
                level = level,
                battery = battery
            )

            record.date = date
            record.save(update_fields = ["date"])
            date += timedelta(hours = 1)

            if machine.max_level != None and level == machine.max_level or level == 250: level = 0
            else: level += 1

            if battery == 0: battery = 100
            else: battery -= 1