from codecs import latin_1_decode
from datetime import timedelta
from platform import machine
from urllib import response
from venv import create
from django.contrib.auth import get_user_model
from django.shortcuts import resolve_url
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

from machine import serializers


class TestMachineAPIView(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email = "test@gmail.com",
            password = "123456"
        )
        self.token = Token.objects.get(user = self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)

        self.machine_1 = self.user.machine_set.create(
            title = "Summer House",
            code = "123456",
        )
        self.machine_1.record_set.create(level = 10, battery = 100)

        self.machine_2 = self.user.machine_set.create(
            title = "Winter House",
            code = "654321",
        )
        self.machine_2.record_set.create(level = 5, battery = 90)
        
        self.machine_1_url = resolve_url("machine-detail", machine_code = self.machine_1.code)
        self.machine_2_url = resolve_url("machine-detail", machine_code = self.machine_2.code)
        self.machine_both_url = resolve_url("machine-detail-all")

    def test_authenticated_machine(self):
        response = self.client.get(self.machine_1_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        serializer = serializers.MachineSerializer(instance = self.machine_1)
        self.assertEqual(response.data, serializer.data)

    def test_authenticated_all(self):
        response = self.client.get(self.machine_both_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        serializer = serializers.MachineSerializer(instance = self.user.machine_set.all(), many = True)
        self.assertEqual(response.data, serializer.data)

    def test_unauthenticated(self):
        self.client.credentials()
        
        self.assertEqual(
            self.client.get(self.machine_1_url).status_code, 
            self.client.get(self.machine_both_url).status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_invalid_machine_code(self):
        response = self.client.get(
            self.machine_1_url + "0"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_all_machines(self):
        self.assertIsInstance(
            self.client.get(self.machine_both_url).json(), list
        )


class TestRecordsAPIView(APITestCase):
    USER_EMAIL = "test@gmail.com"
    USER_PASSWORD = "123456"
    
    MACHINE_TITLE = "Summer House"
    MACHINE_CODE = "123456"

    def url(self, machine_code: str|None = None, **kwargs):
        machine_code = self.MACHINE_CODE if machine_code == None else machine_code
        return resolve_url("machine-records", machine_code = machine_code, **kwargs)

    def string_to_datetime(self, time: str) -> timezone.datetime:
        return timezone.datetime.strptime(time, "%Y-%m-%dT%H:%M:%S.%f")

    def setUp(self) -> None:
        self.user = get_user_model().objects.create_user(
            email = self.USER_EMAIL,
            password = self.USER_PASSWORD
        )

        self.token = Token.objects.get(user = self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)

    def test_unauthenticated(self):
        self.client.credentials()
        self.assertEqual(
            self.client.get(self.url(time_period = "day")).status_code, status.HTTP_401_UNAUTHORIZED
        )

    def test_invalid_time_period(self):
        self.assertEqual(
            self.client.get(self.url(time_period = "decate")).status_code, status.HTTP_404_NOT_FOUND
        )

    def test_invalid_machine_code(self):
        self.assertEqual(
            self.client.get(self.url(machine_code = self.MACHINE_CODE + "0", time_period = "day")).status_code, status.HTTP_404_NOT_FOUND
        )

    def _test_time_period(self, time_period: str, **kwargs):
        create_timedelta = {key.replace("create", "time"):kwargs[key] for key in kwargs.keys() if key.startswith("create_")}
        response_timedelta = {key.replace("response_", ""):kwargs[key] for key in kwargs.keys() if key.startswith("response_")}

        machine = self.user.machine_set.create_demo(
            title = self.MACHINE_TITLE,
            code = self.MACHINE_CODE,
            **create_timedelta
        )

        response = self.client.get(self.url(time_period = time_period))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        records = response.data["records"]
        record_timedelta = self.string_to_datetime(records[-1]["date"]) - self.string_to_datetime(records[0]["date"]) 
        self.assertTrue(record_timedelta < timedelta(seconds = 1, **response_timedelta))

        return machine, response

    def test_day_time_period(self):
        self._test_time_period(time_period = "day", create_days = 2, response_days = 1)

    def test_week_time_period(self):
        self._test_time_period(time_period = "week", create_days = 14, response_days = 7)

    def test_month_time_period(self):
        self._test_time_period(time_period = "month", create_days = 62, response_days = 31)

    def test_year_time_period(self):
        machine, response = self._test_time_period(time_period = "year", create_days = 366, response_days = 365)

        response_dates = []
        for record in response.data["records"]:
            date = self.string_to_datetime(record["date"])
            date = timezone.datetime(year = date.year, month = date.month, day = date.day)
            response_dates.append(date)

        for record_date in response_dates:
            self.assertEqual(response_dates.count(record_date), 1)

class TestDateRecordsAPIView(APITestCase):
    
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email = "test@gmail.com",
            password = "123456"
        )
        self.token = Token.objects.get(user = self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)

        self.machine = self.user.machine_set.create_demo(
            code = "123456",
            time_days = 3
        )

    def url(self, **kwargs):
        return resolve_url("machine-records-date", machine_code = self.machine.code, **kwargs)

    def test_unauthenticated(self):
        self.client.credentials()
        self.assertEqual(
            self.client.get(self.url(date = "2022-15-1")).status_code, status.HTTP_401_UNAUTHORIZED
        )

    def test_valid(self):
        date = self.machine.record_set.last().date
        url = self.url(date = date.strftime("%Y-%m-%d"))
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        lastest_date = None
        for record in response.data["records"]:
            record_date = record["date"].split("T")[0]
            if lastest_date == None:
                lastest_date = record_date
                continue
            self.assertTrue(lastest_date, record_date)
            lastest_date = record_date


class TestReleaseDateAPIView(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email = "test@gmail.com",
            password = "123456"
        )
        self.token = Token.objects.get(user = self.user)
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)

        self.machine = self.user.machine_set.create_demo(
            code = "123456",
            time_days = 3
        )

        self.url = resolve_url("machine-release-date", machine_code = self.machine.code)

    def test_unauthenticated(self):
        self.client.credentials()
        self.assertEqual(
            self.client.get(self.url).status_code, status.HTTP_401_UNAUTHORIZED
        )

    def test_valid(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("release_date" in response.data.keys())
        self.assertEqual(response.data["release_date"], self.machine.release_date())
