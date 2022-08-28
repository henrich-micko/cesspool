from django.core.management.base import BaseCommand, CommandParser
from machine import models

class Command(BaseCommand):
    help = "Create timeline of records, good for testing and demo"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("--machine-code", type = str, required = True)
        parser.add_argument("--days", default = 5, type = int)
        parser.add_argument("--hour-step", default = 2, type = int)

    def handle(self, *argv, **kwargs):
        machine = models.Machine.objects.create_demo(
            code = kwargs["machine_code"],
            time_days = kwargs["days"],
            time_hour_step = kwargs["hour_step"]
        )

        print(machine)