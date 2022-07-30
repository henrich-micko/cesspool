from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from . import serializers, models


# Get list of machines
class MachinesListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.MachineSerializer

    def get_queryset(self):
        return self.request.user.machine_set.all()


# Get list of records of spec machine
class RecordsListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.RecordSerializer

    def get_queryset(self):
        machine_id = self.request.query_params.get("machine", None)
        records = self.request.query_params.get("records", None)

        if machine_id == None:
            raise ValidationError({"detail": "Machine id must be set in 'machine' query parameter."})
        machine = models.Machine.objects.get(id = machine_id)

        if records != None:
            output = machine.objects.lastn(num = int(records))
        else:
            output = machine.objects.all()

        return output