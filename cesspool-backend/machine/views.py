from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated

from datetime import datetime, timedelta

from . import serializers, models


def get_machine_from_user(user, code):
    if user.is_staff:
        machines = models.Machine.objects.all()
    else:
        machines = user.machine_set.all()

    return get_object_or_404(machines, code = code)


class MachineDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, machine_code: str|None = None) -> Response:
        if machine_code != None: 
            machine = get_machine_from_user(request.user, code = machine_code)
            machine_serializer = serializers.MachineSerializer(instance = machine)
        else:
            machine_serializer = serializers.MachineSerializer(instance = request.user.machine_set, many = True)
        
        return Response(machine_serializer.data, status = status.HTTP_200_OK)


class MachineConfAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, machine_code: str):
        machine = get_machine_from_user(request.user, code = machine_code)
        serializer = serializers.MachineSerializer(instance = machine, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class RecordsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, machine_code: str, time_period: str):
        machine = get_machine_from_user(request.user, code = machine_code)

        match time_period:
            case "day": 
                records = machine.record_set.time_period(days = 1)            
            case "week":
                records = machine.record_set.time_period(weeks = 1)
            case "month": 
                records = machine.record_set.time_period(days = 31)
            case "year": 
                records = machine.record_set.time_period(days = 365).last_by(lambda item: item.date.strftime("%Y-%m-%d"))
            case other: 
                return Response(status = status.HTTP_400_BAD_REQUEST)

        records_serializer = serializers.RecordSerializer(records, many = True)
        return Response(records_serializer.data, status = status.HTTP_200_OK)


class RecordsSupportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_records_timedelta(self, machine, **kwargs):
        output = machine.record_set.time_period(**kwargs).timedelta() 
        if output == None:
            return timedelta(seconds = 0)
        return output

    def get(self, request, machine_code: str):
        machine = get_machine_from_user(request.user, code = machine_code)
        
        data = {
            "year": self.get_records_timedelta(machine, days = 365) >= timedelta(days = 31),
            "month": self.get_records_timedelta(machine, weeks = 31) >= timedelta(days = 6, hours = 23),
            "week": self.get_records_timedelta(machine, weeks = 1) >= timedelta(hours = 43),
            "day": True
        }

        return Response(data = data, status = status.HTTP_200_OK)


class DateRecordsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, machine_code: str, date: str):
        machine = get_machine_from_user(request.user, code = machine_code)
        
        date = datetime.strptime(date, "%Y-%m-%d")
        timerange = [date, date + timedelta(days = 1)]
        
        records = machine.record_set.filter(date__range = timerange)

        serializer = serializers.RecordSerializer(many = True, instance = records)
        return Response(data = serializer.data, status = status.HTTP_200_OK)


class MachineReleaseDateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, machine_code: str):
        machine = get_machine_from_user(request.user, code = machine_code)
        release_date = machine.release_date()
        data = {
            "release_date": release_date,
        }
        return Response(data, status = status.HTTP_200_OK)