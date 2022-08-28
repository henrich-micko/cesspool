from django.test import TestCase
from django.utils import timezone

from machine import models

import datetime

class TestStatus(TestCase):

    # get
    def test_get(self):
        self.assertEqual(
            models.Status.get("NO_USER"), models.Status.NO_USER 
        )

    def test_get_with_invalid_name(self):
        self.assertEqual(
            models.Status.get("NO_CLUE"), None
        )

    def test_get_default(self):
        self.assertEqual(
            models.Status.get("NO_CLUE", default = 111), 111
        )

    # to_json
    def test_to_json_with_status(self):
        self.assertIsInstance(
            models.Status.to_json(models.Status.NO_USER), dict
        )

    def test_to_json_with_string_status_name(self):
        self.assertIsInstance(
            models.Status.to_json("NO_USER"), dict
        )

class TestMachineModels(TestCase):
    MACHINE_TITLE = "Summer House"
    MACHINE_MAX_LEVEL = 250
    MACHINE_CODE = "123456"

    def setUp(self):
        self.machine = models.Machine.objects.create(
            title = self.MACHINE_TITLE,
            max_level = self.MACHINE_MAX_LEVEL,
            code = self.MACHINE_CODE
        )
        
    # level and battery
    def test_level_battery(self):
        self.machine.record_set.create(level = 25, battery = 30)

        self.assertEqual(self.machine.level, 25)
        self.assertEqual(self.machine.battery, 30)

    def test_level_battery_without_record(self):
        self.assertEquals(self.machine.level, self.machine.battery, None)

    # get_level_percent
    def test_get_level_percent(self):
        self.machine.record_set.create(level = 25)
        self.assertEqual(self.machine.get_level_percent(), 10)

    def test_get_level_percent_without_max_level(self):
        self.machine.record_set.create(level = 25)
        self.machine.max_level = None
        self.machine.save()

        self.assertEqual(self.machine.get_level_percent(), None)

    def test_get_level_percent_without_max_level_and_record(self):
        self.machine.max_level = None
        self.machine.save()

        self.assertEqual(self.machine.get_level_percent(), None)

    def test_get_level_percent_without_default_record(self):
        per_level = self.machine.get_level_percent(level = 25)
        self.assertEqual(per_level, 10)

    # last_update
    def test_last_update(self):
        self.machine.record_set.create()
        self.assertEqual(self.machine.last_update, self.machine.record_set.last().date)

    def test_last_update_without_record(self):
        self.machine.record_set.all().delete()
        self.assertEqual(self.machine.last_update, None)

    # problem scan
    def test_problem_scan_no_user(self):
        self.machine.user = None
        self.machine.save()
        self.assertTrue(models.Status.NO_USER in self.machine.problem_scan())

    def test_problem_scan_no_records(self):
        self.machine.record_set.all().delete()
        self.assertTrue(models.Status.NO_RECORDS in self.machine.problem_scan())

    def test_problem_scan_no_max_level(self):
        self.machine.max_level = None
        self.machine.save()
        self.assertTrue(models.Status.NO_MAX_LEVEL in self.machine.problem_scan())

    def test_problem_scan_no_title(self):
        self.machine.title = None
        self.machine.save()
        self.assertTrue(models.Status.NO_TITLE in self.machine.problem_scan())

    def test_problem_scan_hight_level(self):
        self.machine.record_set.create(level = self.MACHINE_MAX_LEVEL)
        self.assertTrue(models.Status.HIGHT_LEVEL in self.machine.problem_scan())

    def test_problem_scan_low_battery(self):
        self.machine.record_set.create(battery = 1)
        self.assertTrue(models.Status.LOW_BATTERY in self.machine.problem_scan())

    def test_problem_scan_old_recored(self):
        self.machine.record_set.all().delete()
        record = self.machine.record_set.create()
        record.date = timezone.datetime(year = 1994, month = 4, day = 5, hour = 10, minute = 25, second = 5)
        record.save(update_fields = ["date"])
        self.assertTrue(models.Status.OLD_RECORD in self.machine.problem_scan())

    # create
    def test_create_capitalize_title(self):
        machine = models.Machine.objects.create(title = "title")
        self.assertEqual(machine.title, "Title")

    # release_date
    def test_release_date_valid(self):
        self.machine.record_set.create(level = 5)
        self.machine.record_set.create(level = 10)
        self.assertIsInstance(self.machine.release_date(), datetime.date)

    def test_release_date_without_max_level(self):
        self.machine.max_level = None
        self.machine.save()
        self.assertEqual(self.machine.release_date(), None)

    def test_release_date_without_records(self):
        self.assertEqual(self.machine.release_date(), None)

    def test_release_date_with_one_record(self):
        self.machine.record_set.create(level = 5)
        self.assertEqual(self.machine.release_date(), None)

    def test_release_date_with_negative_rise(self):
        self.machine.record_set.create(level = 10)
        self.machine.record_set.create(level = 5)
        self.assertEqual(self.machine.release_date(), None)

    def test_release_date_with_old_negative_rise(self):
        self.machine.record_set.create(level = 10)
        self.machine.record_set.create(level = 5)
        self.machine.record_set.create(level = 15)
        self.assertIsInstance(self.machine.release_date(), datetime.date)


class TestRecordModel(TestCase):
    def setUp(self):
        self.machine = models.Machine.objects.create(title = "house", max_level = 250)
        self.record = self.machine.record_set.create(level = 50, battery = 50)

    # rise
    def test_rise(self):
        last_record_level = self.record.level
        new_record = self.machine.record_set.create(level = last_record_level + 10)
        self.assertEqual(10, new_record.rise())

    def test_rise_while_level_is_going_down(self):
        last_record_level = self.record.level
        new_record = self.machine.record_set.create(level = last_record_level - 10)
        self.assertEqual(-10, new_record.rise())

    def test_rise_without_default(self):
        new_record = self.machine.record_set.create(level = self.record.level + 10)
        self.assertEqual(10, new_record.rise(self.record))

    # rise percent
    def test_percent_rise(self):
        last_record_level = self.record.level
        new_record = self.machine.record_set.create(level = last_record_level + 10)
        self.assertEqual(4.0, new_record.rise_percent())

    def test_percent_rise_while_level_is_going_down(self):
        last_record_level = self.record.level
        new_record = self.machine.record_set.create(level = last_record_level - 10)
        self.assertEqual(-4.0, new_record.rise_percent())

    def test_percent_rise_without_default(self):
        new_record = self.machine.record_set.create(level = self.record.level - 10)
        self.assertEqual(-4.0, new_record.rise_percent(self.record))

    # is_valid
    def test_is_valid(self):
        self.machine.record_set.create(level = 10)
        invalid_record = self.machine.record_set.create(level = 150)
        self.machine.record_set.create(level = 15)
        self.assertFalse(invalid_record.is_valid())

    def test_is_invalid_without_record(self):
        self.assertEqual(self.record.is_valid(), None)

    def test_valid_with_valid(self):
        self.machine.record_set.create(level = 10)
        valid_record = self.machine.record_set.create(level = 12)
        self.machine.record_set.create(level = 15)
        self.assertTrue(valid_record.is_valid())