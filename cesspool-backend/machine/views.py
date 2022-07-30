from rest_framework import status
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated

from . import serializers


class MachineDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, code: str):
        machine = request.user.machine_set.get(code = code)
        if machine == None:
            return Response({"detail": "This user doesn't own machine with this code."}, status = status.HTTP_404_NOT_FOUND)

        machine_serializer = serializers.MachineSerializer(instance = machine)
        return Response(machine_serializer.data, status = status.HTTP_200_OK)

machine_detail_view = MachineDetailAPIView.as_view()


class MyMachinesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        machines = request.user.machine_set.all()
        machines_serializer = serializers.MachineSerializer(instance = machines, many = True)
        return Response(machines_serializer.data, status = status.HTTP_200_OK)

my_machines_view = MyMachinesAPIView.as_view()


class RecordsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code: str):
        machine = request.user.machine_set.get(code = code)
        if machine == None:
            return Response({"detail": "This user doesn't own machine with this code."}, status = status.HTTP_404_NOT_FOUND)

        records = machine.record_set.all()
        records_serializer = serializers.RecordSerializer(instance = records, many = True)
        
        return Response(records_serializer.data, status = status.HTTP_200_OK)

records_view = RecordsAPIView.as_view()