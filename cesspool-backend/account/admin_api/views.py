from django.conf import settings

from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from account.admin_api.serializers import UserAccountAdminSerializer
from account import models, tasks
from utils.generics import RestoreModelAPIView
from utils.permission import has_user_permission
from utils.utils import generate_code


class ListUserAccountAPIView(ListAPIView):
    permission_classes = has_user_permission("account.manage_account")
    serializer_class = UserAccountAdminSerializer

    def get_queryset(self):
        return models.UserAccount.objects.all()
    

class RUDUserAccountAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = has_user_permission("account.manage_account")
    serializer_class = UserAccountAdminSerializer
    lookup_field = "pk"

    def get_queryset(self):
        return models.UserAccount.objects.all()
    

class RestoreUserAccountAPIView(RestoreModelAPIView):
    permission_classes = has_user_permission("account.manage_account")
    serializer_class = UserAccountAdminSerializer
    lookup_field = "pk"

    def get_queryset(self):
        return models.UserAccount.objects.all()


class CreateUserAccountAPIView(APIView):
    permission_classes = has_user_permission("account.manage_account")

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
    

class GroupsAPIView(APIView):
    permission_classes = has_user_permission("account.manage_account")

    def get(self, request):
        return Response(settings.USER_GROUPS.keys(), status = status.HTTP_200_OK)