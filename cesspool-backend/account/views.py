from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from . import serializers

# Create your views here.

class CreateUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = serializers.CreateUserSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(status = status.HTTP_201_CREATED)
        return Response(serializer.error, status = status.HTTP_400_BAD_REQUEST)


class BlackListTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = serializers.BlacklistTokenSerializer(data = request.data)

        if not serializer.is_valid():
            return Response(status = status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(request.data["refresh_token"])
        token.blacklist()

        return Response(status = status.HTTP_200_OK)


class TestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"text": "hello world"}, status = status.HTTP_200_OK)