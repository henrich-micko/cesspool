from django.test import TestCase
from django.utils import timezone

from machine import models

from datetime import timedelta

class TestModels(TestCase):

    # def setUp(self):
    #     self.machine = models.Machine.objects.create(
    #         title = "global_testing",
    #         code = "000001"
    #     )

    #     record_date = datetime.now(tz = timezone.utc)
    #     level = 0
    #     battery = 100

    #     for i in range(365 * 24):
    #         record = self.machine.record_set.create(
    #             level = level,
    #             battery = battery
    #         )

    #         record.date = record_date
    #         record.save(update_fields=["date"])

    #         if self.machine.max_level != None and level == self.machine.max_level: level = 0
    #         else: level += 1

    #         if battery == 0: battery = 100
    #         else: battery -= 1

    #         record_date = record_date - timedelta(hours = 1)

    def test_level_average(self):
        machine = models.Machine.objects.create(
            title = "test_level_average",
        )

        for i in range(1, 5):
            machine.record_set.create(
                level = i,
                battery = 100
            )

        self.assertEqual(machine.record_set.all().get_level_average(), 2.5)

    def test_time_period(self):
        machine = models.Machine.objects.create(
            title = "test_time_period"
        )

        date = now = timezone.now()

        for i in range(5 * 24): # days * hours
            record = machine.record_set.create(
                level = i,
                battery = 100
            )

            record.date = date
            record.save(update_fields = ["date"])

            date = date - timedelta(hours = 1)

        time_period = machine.record_set.time_period(days = 4)
        last_record = time_period.order_by("-date").last()

        self.assertTrue(
           last_record.date > now - timedelta(days = 4, seconds = 1)
        )