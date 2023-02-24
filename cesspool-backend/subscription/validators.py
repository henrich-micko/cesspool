from django.core.exceptions import ValidationError


def validate_max_owners(value):
    if value <= 0:
        raise ValidationError("max_owners cant be 0 or less")
    return value


def validate_subscription(value):
    from subscription.models import Subscription

    try: Subscription.objects.get(title = value)
    except Subscription.DoesNotExist: raise ValidationError("Subscription with this title doesnt exists")
    return value