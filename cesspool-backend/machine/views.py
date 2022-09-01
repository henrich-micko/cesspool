from urllib import request
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from datetime import datetime, timedelta

from . import serializers, models


class MachineDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, machine_code: str|None = None) -> Response:
        if machine_code != None: 
            machine = get_object_or_404(request.user.machine_set, code = machine_code)
            machine_serializer = serializers.MachineSerializer(instance = machine)
        else:
            machine_serializer = serializers.MachineSerializer(instance = request.user.machine_set, many = True)
        
        return Response(machine_serializer.data, status = status.HTTP_200_OK)


class MachineConfAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, machine_code: str):
        machine = get_object_or_404(request.user.machine_set, code = machine_code)
        serializer = serializers.MachineSerializer(instance = machine, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class RecordsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, machine_code: str, time_period: str):
        machine = get_object_or_404(request.user.machine_set, code = machine_code)

        match time_period:
            case "day": 
                records = machine.record_set.time_period(days = 1)
                is_enought = len(records) >= 2
            
            case "week":
                records = machine.record_set.time_period(weeks = 1)
                records_timedelta = records.timedelta()
                is_enought = records_timedelta != None and records_timedelta >= timedelta(hours = 43)
            
            case "month": 
                records = machine.record_set.time_period(days = 31)
                records_timedelta = records.timedelta()
                is_enought = records_timedelta != None and records_timedelta >= timedelta(days = 6, hours = 23)
            
            case "year": 
                records = machine.record_set.time_period(days = 365).last_by(lambda item: item.date.strftime("%Y-%m-%d"))
                records_timedelta = records.timedelta()
                is_enought = records_timedelta != None and records_timedelta >= timedelta(days = 31)
            
            case other: 
                return Response(status = status.HTTP_400_BAD_REQUEST)

        records_serializer = serializers.RecordSerializer(records, many = True)
        data = {"is_enought": is_enought, "records": records_serializer.data}
        return Response(data, status = status.HTTP_200_OK)


class DateRecordsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, machine_code: str, date: str):
        machine = get_object_or_404(request.user.machine_set, code = machine_code)
        
        date = datetime.strptime(date, "%Y-%m-%d")
        timerange = [date, date + timedelta(days = 1)]
        
        records = machine.record_set.filter(date__range = timerange)
        records_timedelta = records.timedelta()
        is_enought = records_timedelta != None and records_timedelta >= timedelta(hours = 12)

        serializer = serializers.RecordSerializer(many = True, instance = records)
        data = {"is_enought": is_enought, "records": serializer.data}

        return Response(data = data, status = status.HTTP_200_OK)


# this is not included in basic Machine view
# because it took to much time to run
class MachineReleaseDateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, machine_code: str):
        machine = get_object_or_404(request.user.machine_set, code = machine_code)
        return Response({"release_date": machine.release_date()}, status = status.HTTP_200_OK)