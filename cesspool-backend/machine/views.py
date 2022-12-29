from rest_framework import status
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated

from datetime import datetime, timedelta

from . import serializers, permission


class MachineDetailAPIView(APIView):
    permission_classes = [IsAuthenticated, *permission.has_user_permission("machine.own_machine", "machine.view_machine")]

    def get(self, request, machine_code: str|None = None) -> Response:
        mtus = request.user.get_machine_to_user(code = machine_code)

        if machine_code != None:
            if mtus == None:
                return Response(status = status.HTTP_404_NOT_FOUND)
            data = serializers.MachineSerializer(instance = mtus.machine, user = mtus.user).data
        else:
            data = serializers.MachineSerializer(instance = [m.machine for m in mtus], user = request.user, many = True).data

        return Response(data = data, status = status.HTTP_200_OK)

class MachineConfAPIView(APIView):
    permission_classes = [IsAuthenticated, *permission.has_user_permission("machine.own_machine", "machine.change_machinetouser")]

    def put(self, request, machine_code: str):
        mtu = request.user.get_machine_to_user(code = machine_code)
        if mtu == None: return Response(status = status.HTTP_404_NOT_FOUND)

        serializer = serializers.MachineToUser(instance = mtu, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data = serializer.data, status = status.HTTP_200_OK)
        
        return Response(data = serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
class RecordsAPIView(APIView):
    permission_classes = [IsAuthenticated,  *permission.has_user_permission("machine.own_machine", "machine.view_record")]

    def get(self, request, machine_code: str):
        machine = request.user.get_machine_to_user_or_404(code = machine_code).machine
        time_period = request.GET.get("tp", "all")

        match time_period:
            case "day": records = machine.record_set.time_period(days = 1)
            case "week": records = machine.record_set.time_period(weeks = 1)
            case "month": records = machine.record_set.time_period(days = 31).last_by(lambda item: item.date.strftime("%Y-%m-%d"))
            case "all": records = machine.record_set.all().last_by(lambda item: item.date.strftime("%Y-%m-%d"))
            case other: return Response(status = status.HTTP_400_BAD_REQUEST)

        records_serializer = serializers.RecordSerializer(records, many = True)
        return Response(records_serializer.data, status = status.HTTP_200_OK)


class RecordsSupportAPIView(APIView):
    permission_classes = [IsAuthenticated, *permission.has_user_permission("machine.own_machine", "machine.view_record")]

    def get_records_timedelta(self, machine, **kwargs):
        output = machine.record_set.time_period(**kwargs).timedelta()
        if output == None:
            return timedelta(seconds = 0)
        return output

    def get(self, request, machine_code: str):
        machine = request.user.get_machine_to_user_or_404(code = machine_code).machine

        data = {
            "month": self.get_records_timedelta(machine, weeks = 31) >= timedelta(days = 6, hours = 23),
            "week": self.get_records_timedelta(machine, weeks = 1) >= timedelta(hours = 43),
            "day": True,
        }

        return Response(data = data, status = status.HTTP_200_OK)


class DateRecordsAPIView(APIView):
    permission_classes = [IsAuthenticated, *permission.has_user_permission("machine.own_machine", "machine.view_record")]

    def get(self, request, machine_code: str, date: str):
        machine = request.user.get_machine_to_user_or_404(code = machine_code).machine

        try: date = datetime.strptime(date, "%Y-%m-%d")
        except ValueError: return Response(data = {"date": "Invalid value: should be -> Y-m-d"}, status = status.HTTP_400_BAD_REQUEST)
        
        timerange = [date, date + timedelta(days = 1)]

        records = machine.record_set.filter(date__range = timerange)

        serializer = serializers.RecordSerializer(many = True, instance = records)
        return Response(data = serializer.data, status = status.HTTP_200_OK)