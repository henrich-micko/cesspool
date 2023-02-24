from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from account import models, tasks, serializers
from utils.generics import RestoreModelAPIView



class ListUserAccountAPIView(ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = serializers.UserAccountSerializer

    def get_queryset(self):
        return models.UserAccount.objects.all()
    

class RUDUserAccountAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = serializers.UserAccountSerializer
    lookup_field = "pk"

    def get_queryset(self):
        return models.UserAccount.objects.all()
    

class RestoreUserAccountAPIView(RestoreModelAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = serializers.UserAccountSerializer
    lookup_field = "pk"

    def get_queryset(self):
        return models.UserAccount.objects.all()


class CreateUserAccountAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = serializers.UserAccountCreateSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(models.generate_code(8))
            user.is_active = False
            user.save()
            
            token = models.ActivateUserToken.objects.create(user = user)
            tasks.send_welcome_email.delay(user_pk = user.pk, token_pk = token.pk)
    
            user_data = serializers.UserAccountSerializer(user).data

            return Response(user_data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)