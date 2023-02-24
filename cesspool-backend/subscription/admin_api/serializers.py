from subscription.serializers import SubscriptionSerializer


class SubscriptionAdminSerializer(SubscriptionSerializer):

    class Meta(SubscriptionSerializer.Meta):
        extra_kwargs = {
            "title": { "read_only": False },
            "about": { "read_only": False },
            "mqtt": { "read_only": False },
            "email_notf": { "read_only": False },
            "sms_notf": { "read_only": False },
            "max_owners": { "read_only": False },
        }