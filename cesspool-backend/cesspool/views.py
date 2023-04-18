from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from utils.permission import has_user_permission
from cesspool.serializers import CesspoolToUserSerializer, RecordSerializer, CesspoolToUserWithUsersSerializer
from cesspool.models import CesspoolToUser, Record
from cesspool.utils import try_get_cesspool_from_user_by_code, try_get_cesspool_by_code
from utils.permission import perm_or


class CesspoolToUserMixin:
    permission_classes = [IsAuthenticated, *has_user_permission("cesspool.related_to_cesspool")]
    lookup_field = "cesspool__code"
    lookup_value_regex = "[^/]+"

    @property
    def serializer_class(self):
        user, cesspool = self.request.user, self.kwargs.get("cesspool__code"), 
        try:
            print(user)
            if CesspoolToUser.objects.get(user = user, cesspool__code = cesspool).is_super_owner:
                return CesspoolToUserWithUsersSerializer
        except CesspoolToUser.DoesNotExist:
            pass
        return CesspoolToUserSerializer

    def get_queryset(self):
        return CesspoolToUser.objects.filter(user = self.request.user)
    

class ListCesspolAPIView(CesspoolToUserMixin, APIView):
    """ Get List of ctus related to loged user """

    def get(self, request):
        response_data = []
        for ctu in self.get_queryset():
            if ctu.is_super_owner:
                ser = CesspoolToUserWithUsersSerializer(instance = ctu)
            else:
                ser = CesspoolToUserSerializer(instance = ctu)
            response_data.append(ser.data)
        return Response(data = response_data, status = status.HTTP_200_OK)


class RUDAPIView(CesspoolToUserMixin, RetrieveUpdateAPIView):
    """Retreive Update and Delete methods for spec ctu """


class RecordsAPIView(ListAPIView):
    permission_classes = [perm_or(*has_user_permission("cesspool.related_to_cesspool", "cesspool.manage_cesspool"))]
    serializer_class = RecordSerializer
    lookup_field = "cesspool__code"
    lookup_value_regex = "[^/]+"
    
    def get_queryset(self):
        cesspool_code, time_filter = self.kwargs.get("cesspool_code"), self.kwargs.get("tf")

        if self.request.user.has_perm("cesspool.related_to_cesspool"):
            cesspool = try_get_cesspool_from_user_by_code(user = self.request.user, cesspool__code = cesspool_code)
        else:
            cesspool = try_get_cesspool_by_code(code = cesspool_code)

        match time_filter:
            case "day": 
                return cesspool.record_set.time_period(days = 1)
            case "week":
                return cesspool.record_set.time_period(weeks = 1)
            case "month":
                return cesspool.record_set.time_period(days = 31)

        # all
        return cesspool.record_set.all()
    

class RecordsDateAPIView(ListAPIView):
    permission_classes = [perm_or(*has_user_permission("cesspool.related_to_cesspool", "cesspool.manage_cesspool"))]
    serializer_class = RecordSerializer
    lookup_field = "cesspool__code"
    lookup_value_regex = "[^/]+"

    def get_queryset(self):
        cesspool_code, date = self.kwargs.get("cesspool_code"), self.kwargs.get("date")
        cesspool = try_get_cesspool_from_user_by_code(user = self.request.user, cesspool_code = cesspool_code)
        
        if self.request.user.has_perm("cesspool.related_to_cesspool"):
            cesspool = try_get_cesspool_from_user_by_code(user = self.request.user, cesspool__code = cesspool_code)
        else:
            cesspool = try_get_cesspool_by_code(code = cesspool_code)
        
        date = timezone.datetime.strptime(date, "%Y-%m-%d")

        return Record.objects.filter(
            cesspool = cesspool, 
            date__year = date.year, 
            date__month = date.month,
            date__day = date.day 
        ) # this kinda sucks
    

class RecordsSupportAPIView(APIView):
    permission_classes = [perm_or(*has_user_permission("cesspool.related_to_cesspool", "cesspool.manage_cesspool"))]
    lookup_field = "cesspool__code"
    lookup_value_regex = "[^/]+"

    def get(self, request, cesspool_code):
        if request.user.has_perm("cesspool.related_to_cesspool"):
            cesspool = try_get_cesspool_from_user_by_code(user = request.user, cesspool__code = cesspool_code)
        
        else:
            cesspool = try_get_cesspool_by_code(code = cesspool_code)

        cesspool_last_record = cesspool.record_set.last()
        now_ = timezone.now()

        data = {
            "all": cesspool_last_record != None,
            "day": cesspool_last_record != None,
            "week": cesspool_last_record != None and cesspool_last_record.date < now_ - timezone.timedelta(days = 1),
            "month": cesspool_last_record != None and cesspool_last_record.date < now_ - timezone.timedelta(days = 7)
        }

        return Response(data, status = status.HTTP_200_OK)