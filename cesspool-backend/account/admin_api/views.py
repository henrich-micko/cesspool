from datetime import timedelta
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.utils import timezone

from account import models
from account import serializers as account_serializer

from . import serializers

# list of machines
class AdminAccountListAPIView(ListAPIView):
    queryset = models.UserAccount.objects.all()
    serializer_class = account_serializer.UserAccountSerializer
    permission_classes = [IsAdminUser]

class UserAccountAPIView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, user_pk: int):
        user = get_object_or_404(models.UserAccount.objects.all(), pk = user_pk)
        serializer = account_serializer.UserAccountSerializer(instance = user, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

    def get(self, request, user_pk: int):
        user = get_object_or_404(models.UserAccount.objects.all(), pk = user_pk)
        serializer = account_serializer.UserAccountSerializer(instance = user)
        return Response(serializer.data, status = status.HTTP_200_OK)

    def delete(self, request, user_pk: int):
        user = get_object_or_404(models.UserAccount.objects.all(), pk = user_pk)
        user.action_at(models.AccountDeleteAction, timezone.now() + timedelta(days = 1))
        serializer = account_serializer.UserAccountSerializer(instance = user)
        return Response(serializer.data, status = status.HTTP_200_OK)

class UserAccountCreateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = account_serializer.UserAccountSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class UserAbortActionAPIView(APIView):
    permission_classes = [IsAdminUser]
    action = None

    def get(self, request, user_pk: int):
        if self.action != None:
            user = get_object_or_404(models.UserAccount.objects.all(), pk = user_pk)
            action = user.one_to_one(self.action)

            if action != None:
                action.delete()

            serializer = serializers.UserAccountSerializer(instance = user)
            return Response(serializer.data, status = status.HTTP_200_OK)

        raise ValueError("Action cant be sat to None")

class UserMachineAPIView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, user_pk: int):
        user = get_object_or_404(models.UserAccount.objects.all(), pk = user_pk)
        user.action_at(models.AccountDeleteMachinesAction, timezone.now() + timedelta(days = 1))
        serializer = serializers.UserAccountSerializer(instance = user)
        
        return Response(serializer.data, status = status.HTTP_200_OK)

class UserAbortDeleteAPIView(UserAbortActionAPIView):
    action = models.AccountDeleteAction

class UserAbortDeleteMachinesAPIView(UserAbortActionAPIView):
    action = models.AccountDeleteMachinesAction