from django.test import TestCase
from django.db.utils import IntegrityError

from rest_framework.authtoken.models import Token

from account import models


class TestUserAccountManager(TestCase):
    def test_create_user(self):
        user = models.UserAccount.objects.create_user(
            email = "testing@gmail.com",
            password = "123456"
        )

        self.assertTrue(Token.objects.get(user = user) != None)
        self.assertFalse(user.is_staff) 
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_create_superuser(self):
        user = models.UserAccount.objects.create_superuser(
            email = "testing@gmail.com",
            password = "123456"
        )

        self.assertTrue(Token.objects.get(user = user) != None)
        self.assertTrue(user.is_staff) 
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_create_user_with_used_email(self):
        models.UserAccount.objects.create_user(
            email = "testing@gmail.com",
            password = "123456"
        )

        with self.assertRaises(IntegrityError):
            models.UserAccount.objects.create_user(
                email = "testing@gmail.com",
                password = "123456"
            )