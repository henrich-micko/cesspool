from rest_framework.permissions import IsAuthenticated

from subscription.serializers import SubscriptionSerializer
from subscription.models import Subscription


class SubscriptionMixin:
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.all()