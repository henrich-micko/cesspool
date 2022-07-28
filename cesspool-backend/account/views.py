from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from . import serializers

# Create your views here.

class CreateUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = serializers.CreateUserSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response({"token": Token.objects.get(user = user).key}, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class LogoutAll(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        Token.objects.get(user = request.user).delete()
        return Response(status = status.HTTP_200_OK)


class WhoAmI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        serializer = serializers.UserAccountSerializer(instance = request.user)
        return Response(serializer.data, status = status.HTTP_200_OK)