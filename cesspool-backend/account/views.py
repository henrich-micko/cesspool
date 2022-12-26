from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from account import tasks

from account.models import UserAccount

from . import serializers, models


class LogoutAllAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        Token.objects.get(user = request.user).delete()
        return Response(status = status.HTTP_200_OK)

class WhoAmIAPIview(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = serializers.UserAccountSerializer(instance = request.user)
        return Response(serializer.data, status = status.HTTP_200_OK)

# Get new token for user which is sand via email
class ResetPasswordAPIView(APIView):

    def post(self, request):
        serializer = serializers.ResetPasswordSerializer(data = request.data)
        if serializer.is_valid():
            email = serializer.data.get("user")
            user = models.UserAccount.objects.get(email = email)

            old_token = models.ResetPasswordToken.objects.filter(user = user).first()
            if old_token != None: 
                old_token.delete()
            
            token = models.ResetPasswordToken.objects.create(user = user)
            tasks.send_reset_password_token_email.delay(token_pk = token.pk)

            return Response(status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

# send token and new password
class ResetPasswordSubmitAPIView(APIView):

    def post(self, request):
        serializer = serializers.ResetPasswordSubmitSerializer(data = request.data)
        
        if serializer.is_valid():
            token_string = serializer.validated_data.get("token")
            token = models.ResetPasswordToken.objects.get(token = token_string)
            user = token.user

            if not user.is_active:
                user.is_active = True

            user.set_password(serializer.validated_data.get("password"))
            user.save()
            token.delete()

            return Response(status = status.HTTP_200_OK)

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

# Check if token exists
class ResetPasswordCheckTokenAPIView(APIView):

    def post(self, request):
        serializer = serializers.ResetPasswordTokenSerializer(data = request.data)
        if serializer.is_valid():
            return Response(status = status.HTTP_200_OK)

        token_string = serializer.validated_data.get("token")
        token = models.ResetPasswordToken.objects.filter(token = token_string).first()
        if token != None: 
            token.delete()

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

# Send with token that was created while creating and new password
class ActivateUserAPIView(APIView):

    def post(self, request):
        serializer = serializers.ActivateUserSerializer(data = request.data)
        
        if serializer.is_valid():
            token_string = serializer.validated_data.get("token")
            token = models.ActivateUserToken.objects.get(token = token_string)
            user = token.user

            user.set_password(serializer.validated_data.get("password"))
            user.is_active = True

            user.save()
            token.delete()

            return Response(status = status.HTTP_200_OK)

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

# check if its token okay
class ActivateUserCheckTokenAPIView(APIView):

    def post(self, request):
        serializer = serializers.ActivateUserCheckTokenSerializer(data = request.data)
        if serializer.is_valid():
            return Response(status = status.HTTP_200_OK)

        token_string = serializer.validated_data.get("token")
        token = models.ActivateUserToken.objects.filter(token = token_string).first()
        if token != None: 
            token.delete()

        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)