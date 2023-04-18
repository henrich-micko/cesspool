from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from cesspool.records_api.mixins import RecordsMixin


class RecordsByTFAPIView(RecordsMixin, ListAPIView):
    def get_queryset(self):
        output = super().get_queryset()
        time_filter = self.kwargs.get("tf")

        match time_filter:
            case "day": return output.time_filter(days = 1)
            case "week": return output.time_filter(days = 7)
            case "month": return output.time_filter(days = 31)

        return output
    
records_by_tf_api_view = RecordsByTFAPIView.as_view()


class RecordsByTFSupportAPIView(RecordsMixin, APIView):
    def get(self, request, cesspool__code):
        queryset = super().get_queryset()
        record = queryset.last()
        rn = timezone.now()

        return Response({
            "day": record != None and record.date > rn - timezone.timedelta(days = 1),
            "week": record != None and record.date < rn - timezone.timedelta(days = 1),
            "month": record != None and record.date < rn - timezone.timedelta(days = 7),
            "all": record != None,
        }, status = status.HTTP_200_OK)
    
records_by_tf_support_api_view = RecordsByTFSupportAPIView.as_view()


class RecordsByDateAPIView(RecordsMixin, ListAPIView):
    def get_queryset(self):
        return super().get_queryset().filter(
            date__year = self.kwargs.get("year"),
            date__month = self.kwargs.get("month"),
            date__day = self.kwargs.get("day")
        )

records_by_date_api_view = RecordsByDateAPIView.as_view()