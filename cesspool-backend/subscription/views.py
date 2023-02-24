from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from subscription.serializers import SubscriptionSerializer
from subscription.models import Subscription


class BaseSubscriptionAPIView:
    permissions = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def get_queryset(self):
        return Subscription.objects.all()

class SubscriptionListAPIView(BaseSubscriptionAPIView, 
                              ListAPIView):
    pass


class SubscriptionRetrieveAPIView(BaseSubscriptionAPIView, 
                                  RetrieveAPIView):
    lookup_field = "title"