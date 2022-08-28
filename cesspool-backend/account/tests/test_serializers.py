from django.test import TestCase

from account import serializers, models


class TestCreateUserSerializer(TestCase):
    def test_week_password(self):
        serializer = serializers.CreateUserSerializer(data = {"email": "testing@gmail.com", "password": "x"})
        self.assertFalse(serializer.is_valid()) 
        self.assertEqual(serializer.errors, {"password": ["Password is too wick."]})

    def test_create(self):
        serializer = serializers.CreateUserSerializer(data = {"email": "testing@gmail.com", "password": "12345678"})
        self.assertTrue(serializer.is_valid())

        serializer.save()
        self.assertTrue(
            models.UserAccount.objects.filter(email = "testing@gmail.com").first() != None
        )