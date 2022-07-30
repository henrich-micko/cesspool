from django.test import TestCase
from django.utils import timezone

from machine import models

from datetime import datetime, timedelta

class TestModels(TestCase):

    # def setUp(self):
        # self.machine_1 = models.Machine.objects.create(
        #     title = "machine_test_1",
        #     code = "000001"
        # )

        # record_date = datetime.now(tz = timezone.utc)
        # level = 0
        # battery = 100

        # for i in range(345 * 24):
        #     record = self.machine_1.record_set.create(
        #         level = level,
        #         battery = battery
        #     )

        #     record.date = record_date
        #     record.save(update_fields=["date"])

        #     if self.machine_1.max_level != None and level == self.machine_1.max_level: level = 0
        #     else: level += 1

        #     if battery == 0: battery = 100
        #     else: battery -= 1

        #     record_date = record_date - timedelta(hours = 1)

        # # For testing level average
        # self.machine_2 = models.Machine.objects.create(
        #     title = "machine_test_2",
        #     code = "000002"
        # )

        # for i in range(10):
        #     record = self.machine_1.record_set.create(
        #         level = i,
        #         battery = 100
        #     )

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
