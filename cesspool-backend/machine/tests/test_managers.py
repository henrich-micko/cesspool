from django.test import TestCase
from django.utils import timezone

from datetime import datetime, timedelta

from machine import models


class TestMachineManage(TestCase):
    def test_create_demo(self):
        records = models.Machine.objects.create_demo(time_hour_step = 5, time_days = 5).record_set.all()
        today_date = timezone.now()

        last_record_date = None
        for record in records:
            if last_record_date == None:
                last_record_date = record.date
                continue
            self.assertEqual(last_record_date, record.date - timedelta(hours = 5))
            last_record_date = record.date


        self.assertTrue(records.first().date > today_date - timedelta(days = 5, seconds = 1))
        self.assertTrue(records.last().date < today_date)

    def test_create_demo_with_invalid_hour_step(self):
        with self.assertRaises(ValueError):
            models.Machine.objects.create_demo(time_hour_step = -1, time_days = 5)
        with self.assertRaises(ValueError):
            models.Machine.objects.create_demo(time_hour_step = 0, time_days = 5)

    def test_create_demo_without_timedelta_params(self):
        with self.assertRaises(ValueError):
            models.Machine.objects.create_demo()

class TestRecordRecordQuerySet(TestCase):
    def test_get_level_average(self):
        machine = models.Machine.objects.create()

        for i in range(1, 5):
            machine.record_set.create(
                level = i,
                battery = 100
            )

        self.assertEqual(machine.record_set.all().get_level_average(), 2.5)

    def test_time_period(self):
        machine = models.Machine.objects.create_demo(time_days = 5)

        time_period = machine.record_set.time_period(days = 4)
        last_record = time_period.order_by("-date").last()

        self.assertTrue(
           last_record.date > machine.get_record().date - timedelta(days = 4, seconds = 1)
        )

    def test_last_by(self):
        machine = models.Machine.objects.create_demo(time_days = 3)
        quearyset = machine.record_set.last_by(
                lambda item: f"{item.date.year}{item.date.month}{item.date.day}"
            )
        self.assertTrue(len(quearyset) == 3 or len(quearyset) == 4)

        dates = []
        for record in quearyset:
            record_date = f"{record.date.year}{record.date.month}{record.date.day}"
            self.assertFalse(record_date in dates)
            dates.append(record_date)