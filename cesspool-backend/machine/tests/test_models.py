from django.test import TestCase

from machine import models


class TestModels(TestCase):

    def test_get_level_percent(self):
        """
        machine.models.Machine.get_level_percent
        """
        machine = models.Machine.objects.create(
            title = "test_get_level_percent",
            max_level = 250
        )

        machine.record_set.create(
            level = 25,
        )

        self.assertEqual(
            machine.get_level_percent(), 10
        )


    def test_machine_status(self):
        """
        machine.models.Machine.status
        """
        machine = models.Machine.objects.create(
            title = "test_machine_status",
            max_level = 250
        )

        self.assertEqual(            
            machine.record_set.create(level = 25).machine.status, 0
        )
        self.assertEqual(            
            machine.record_set.create(level = 130).machine.status, 1
        )
        self.assertEqual(            
            machine.record_set.create(level = 200).machine.status, 2
        )
        self.assertEqual(            
            machine.record_set.create(level = 245).machine.status, 3
        )