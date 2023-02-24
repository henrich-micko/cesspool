from rest_framework import serializers

from subscription.validators import validate_subscription


class SubscriptionField(serializers.CharField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.validators.append(
            validate_subscription
        )