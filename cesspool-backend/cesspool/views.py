from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from utils.permission import has_user_permission
from cesspool.serializers import CesspoolToUserSerializer, RecordSerializer
from cesspool.models import CesspoolToUser, Record, Cesspool
from cesspool.utils import try_get_cesspool_by_code


class BaseCesspoolToOwner:

    permission_classes = [IsAuthenticated, *has_user_permission("cesspool.related_to_cesspool")]
    serializer_class = CesspoolToUserSerializer
    lookup_field = "cesspool__code"
    lookup_value_regex = "[^/]+"

    def get_queryset(self):
        return CesspoolToUser.objects.filter(user = self.request.user)
    

class ListCesspolAPIView(BaseCesspoolToOwner, 
                         ListAPIView):
    pass


class RUDAPIView(BaseCesspoolToOwner, 
                 RetrieveUpdateAPIView):
    pass


class RecordsAPIView(ListAPIView, BaseCesspoolToOwner):
    
    serializer_class = RecordSerializer
    
    def get_queryset(self):
        cesspool_code, time_filter = self.kwargs.get("cesspool_code"), self.kwargs.get("tf")
        cesspool = try_get_cesspool_by_code(user = self.request.user, cesspool_code = cesspool_code)

        match time_filter:
            case "day": 
                return cesspool.record_set.time_period(days = 1)
            case "week":
                return cesspool.record_set.time_period(weeks = 1)
            case "month":
                return cesspool.record_set.time_period(days = 31)

        # all
        return cesspool.record_set.time_period(days = 365).last_by(lambda item: item.date.strftime("%Y-%m-%d"))
    

class RecordsDateAPIView(ListAPIView, BaseCesspoolToOwner):
    serializer_class = RecordSerializer

    def get_queryset(self):
        cesspool_code, date = self.kwargs.get("cesspool_code"), self.kwargs.get("date")
        cesspool = try_get_cesspool_by_code(user = self.request.user, cesspool_code = cesspool_code)
        date = timezone.datetime.strptime(date, "%Y-%m-%d")

        return Record.objects.filter(
            cesspool = cesspool, 
            date__year = date.year, 
            date__month = date.month,
            date__day = date.day 
        ) # this kinda sucks
    

class RecordsSupportAPIView(APIView, BaseCesspoolToOwner):

    def get(self, request, cesspool_code):
        cesspool = try_get_cesspool_by_code(user = request.user, cesspool_code = cesspool_code)
        cesspool_last_record = cesspool.record_set.last()
        now_ = timezone.now()

        data = {
            "all": cesspool_last_record != None,
            "day": cesspool_last_record != None,
            "week": cesspool_last_record != None and cesspool_last_record.date < now_ - timezone.timedelta(days = 1),
            "month": cesspool_last_record != None and cesspool_last_record.date < now_ - timezone.timedelta(days = 7)
        }

        return Response(data, status = status.HTTP_200_OK)