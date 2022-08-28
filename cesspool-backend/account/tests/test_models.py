from django.test import TestCase

from account import models


class TestUserAccount(TestCase):
    def setUp(self):
        self.user = models.UserAccount.objects.create_user(
            email = "testing@gmail.com",
            password = "132456"
        )

    def test__str__(self):
        self.assertEqual(str(self.user), self.user.email)