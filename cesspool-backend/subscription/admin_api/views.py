from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from subscription.admin_api.serializers import SubscriptionAdminSerializer
from subscription.models import Subscription


class SubscriptionBase:
    permissions = [IsAuthenticated, IsAdminUser]
    serializer_class = SubscriptionAdminSerializer

    def get_queryset(self):
        return Subscription.objects.all()


class ListSubscriptionAPIView(SubscriptionBase, ListAPIView):
    pass


class CreateSubscriptionAPIView(SubscriptionBase, CreateAPIView):
    pass


class RUDSubscriptionAPIView(SubscriptionBase, RetrieveUpdateDestroyAPIView):
    lookup_field = "title"
