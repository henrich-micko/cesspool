from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

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


class UserAccountCreateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = account_serializer.UserAccountSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
