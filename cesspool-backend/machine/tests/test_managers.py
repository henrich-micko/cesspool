from django.test import TestCase
from django.utils import timezone

from machine import models

from datetime import timedelta


class TestManagers(TestCase):

    def test_level_average(self):
        """
        machine.managers.RecordQuearySet.get_level_average
        """
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
        """
        machine.managers.RecordQuearySet.time_period

        create 5 days record set and than get 4 days period
        and make sure than last one is not older than 4 days and 1 second
        """
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