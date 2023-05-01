from django.conf import settings

from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from account.admin_api.serializers import UserAccountAdminSerializer
from utils.generics import RestoreModelAPIView
from utils.utils import generate_code
from account.admin_api.mixins import AccountAdminMixin
from cesspool.models import Cesspool
from account.models import UserAccount
from location.models import City


class ListUserAccountAPIView(AccountAdminMixin, ListAPIView):
    pass
    

class RUDUserAccountAPIView(AccountAdminMixin, RetrieveUpdateDestroyAPIView):
    pass


class RestoreUserAccountAPIView(AccountAdminMixin, RestoreModelAPIView):
    pass


class CreateUserAccountAPIView(AccountAdminMixin, APIView):

    def post(self, request):
        serializer = UserAccountAdminSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.created_by = request.user
            user.set_password(generate_code(8))
            user.is_active = False
            user.save()
            
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    

class GroupsAPIView(AccountAdminMixin, APIView):
    def get(self, request):
        return Response(settings.USER_GROUPS.keys(), status = status.HTTP_200_OK)
    

class CreatedByAPIView(AccountAdminMixin, APIView):
    def get(self, request, pk: int):
        output = []

        for c in Cesspool.objects.filter(created_by = pk):
            output.append({
                "pk": c.pk,
                "title": c.code,
                "model": "cesspool.Cesspool",
            })

        for a in UserAccount.objects.filter(created_by = pk):
            output.append({
                "pk": a.pk,
                "title": a.email,
                "model": "account.UserAccount",
            })
        
        for c in City.objects.filter(created_by = pk):
            output.append({
                "pk": c.pk,
                "title": c.district+"/"+c.title,
                "model": "location.City",
            })

        return Response(output, status = status.HTTP_200_OK)