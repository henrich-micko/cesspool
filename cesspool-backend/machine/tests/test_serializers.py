from django.test import TestCase

from machine import models, serializers


class TestMachineSerializer(TestCase):
    def setUp(self):
        self.machine_1 = models.Machine.objects.create(
            title = "Summer house",
            code = "123456",
        )

        self.machine_2 = models.Machine.objects.create(
            title = "Winter house",
            code = "654321",
        )

        self.machine_1.record_set.create(
            level = 10,
            battery = 100
        )

        self.machine_2.record_set.create(
            level = 5,
            battery = 90
        )

    def test_without_record(self):
        self.machine_1.record_set.all().delete()

        serializer = serializers.MachineSerializer(instance = self.machine_1)
        self.assertTrue(
            serializer.data["level"] == 
            serializer.data["battery"] == 
            serializer.data["level_percent"] == 
            serializer.data["last_update"] == 
            None
        )
        self.assertTrue(
            models.Status.to_json("NO_RECORDS") in serializer.data["problems"]
        )

    def test_problems_field(self):
        self.machine_1.title = None
        self.machine_1.save()
        self.assertIsInstance(
            serializers.MachineSerializer(self.machine_1).data["problems"][0], dict
        )