from rest_framework import serializers
from subscription.models import Subscription 


class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscription
        fields = [
            "pk",
            "title",
            "about",
            "mqtt",
            "email_notf",
            "sms_notf",
            "max_owners",
            "month_paying",
            "change_parts",
        ]
        extra_kwargs = {
            "title": { "read_only": True },
            "about": { "read_only": True },
            "mqtt": { "read_only": True },
            "email_notf": { "read_only": True },
            "sms_notf": { "read_only": True },
            "max_owners": { "read_only": True },
            "month_paying": { "read_only": True },
            "change_parts": { "read_only": True }
        }