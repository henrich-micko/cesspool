from unittest import TestCase
from urllib import response
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

from django.shortcuts import resolve_url

from account import models, serializers


class TestCreatUserAPIView(APITestCase):
    url = resolve_url("create-account")

    def test_valid(self):
        response = self.client.post(self.url, {"email": "testing@gmail.com", "password": "12345678"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        user = models.UserAccount.objects.filter(email = "testing@gmail.com").first()
        self.assertTrue(user != None)
        
        if user != None:
            self.assertTrue(Token.objects.get(user = user).key, response.data["token"])
            self.assertFalse(user.is_staff)
            self.assertTrue(user.is_active)

    def test_invalid_data(self):
        response = self.client.post(self.url, {"email": "testing", "password": "x"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_without_data(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_used_email(self):
        models.UserAccount.objects.create(
            email = "testing@gmail.com",
            password = "13245678"
        )

        response = self.client.post(self.url, {"email": "testing@gmail.com", "password": "12345678"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    
class TestLogoutAllAPIView(APITestCase):
    url = resolve_url("logoutall-account")
    
    def setUp(self):
        self.user = models.UserAccount.objects.create_user(
            email = "testing@gmail.com",
            password = "12345678"
        )

        self.token = Token.objects.get(user = self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)

    def test_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(Token.DoesNotExist):
            Token.objects.get(user = self.user)

    def test_unauthenticated(self):
        self.client.credentials()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TestWhoAmI(APITestCase):
    url = resolve_url("whoami-account")

    def setUp(self):
        self.user = models.UserAccount.objects.create_user(
            email = "testing@gmail.com",
            password = "12345678"
        )

        self.token = Token.objects.get(user = self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)

    def test_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        serializer = serializers.UserAccountSerializer(instance = self.user)
        self.assertEqual(serializer.data, response.json())

    def test_unauthenticated(self):
        self.client.credentials()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)