from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from subscription.mixins import SubscriptionMixin


class SubscriptionListAPIView(SubscriptionMixin, ListAPIView):
    pass


class SubscriptionRetrieveAPIView(SubscriptionMixin, RetrieveAPIView):
    lookup_field = "title"