from datetime import timedelta
from readline import insert_text
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status 
from rest_framework.views import APIView, Response
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from machine import models
from . import serializers

from account.models import UserAccount

# list of machines
class AdminMachineListAPIView(ListAPIView):
    queryset = models.Machine.objects.all()
    serializer_class = serializers.AdminMachineDetailSerializer
    permission_classes = [IsAdminUser]


class AdminMachineListOfUserAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_pk: int):
        user = get_object_or_404(UserAccount.objects.all(), pk = user_pk)
        machines = user.machine_set.all()
        serializer = serializers.AdminMachineDetailSerializer(machines, many = True)

        return Response(serializer.data, status = status.HTTP_200_OK)

class AdminMachineAPIView(APIView):
    permission_classes = [IsAdminUser]

    # get info about machine
    def get(self, request, machine_code: str):
        machine = get_object_or_404(models.Machine.objects.all(), code = machine_code)
        serializer = serializers.AdminMachineDetailSerializer(instance = machine)
        return Response(serializer.data, status = status.HTTP_200_OK)

    # conf machine user and code
    def put(self, request, machine_code: str):
        machine = get_object_or_404(models.Machine.objects.all(), code = machine_code)
        serializer = serializers.AdminMachineDetailSerializer(instance = machine, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)    

    # delete machine
    def delete(self, request, machine_code: str):
        machine = get_object_or_404(models.Machine.objects.all(), code = machine_code)
        machine.action_at(models.MachineDeleteAction, timezone.now() + timedelta(days = 1))
        serializer = serializers.AdminMachineDetailSerializer(instance = machine)
        
        return Response(serializer.data, status = status.HTTP_200_OK)


class AdminMachineCreateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = serializers.AdminMachineDetailSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class AdminMachineRecordAPIView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, machine_code: str):
        machine = get_object_or_404(models.Machine.objects.all(), code = machine_code)
        machine.action_at(models.MachineDeleteRecordsAction, timezone.now() + timedelta(days = 1))
        serializer = serializers.AdminMachineDetailSerializer(instance = machine)
        
        return Response(serializer.data, status = status.HTTP_200_OK)


# abstract not used in ulrs
class MachineAbortActionAPIView(APIView):
    permission_classes = [IsAdminUser]
    action = None

    def get(self, request, machine_code: str):
        if self.action != None:
            machine = get_object_or_404(models.Machine.objects.all(), code = machine_code)
            action = machine.one_to_one(self.action)

            if action != None:
                action.delete()

            serializer = serializers.AdminMachineDetailSerializer(instance = machine)
            return Response(serializer.data, status = status.HTTP_200_OK)
        
        raise ValueError("Action cant be None")


class MachineAbortDeleteAPIView(MachineAbortActionAPIView):
    action = models.MachineDeleteAction


class MachineAbortDeleteRecordsAPIView(MachineAbortActionAPIView):
    action = models.MachineDeleteRecordsAction


class MachineCodeGenerateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        machine_code = models.Machine.objects.get_machine_code()
        data = {
            "code": machine_code
        }

        return Response(data, status = status.HTTP_200_OK)