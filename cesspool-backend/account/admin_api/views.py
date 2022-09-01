from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from account import models, serializers


# list of machines
class AdminAccountListAPIView(ListAPIView):
    queryset = models.UserAccount.objects.all()
    serializer_class = serializers.UserAccountSerializer
    permission_classes = [IsAdminUser]