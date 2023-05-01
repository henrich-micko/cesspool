from django.db.models.signals import post_save
from django.dispatch import receiver

from account.models import ActivateUserToken, UserAccount
from account.tasks import send_activate_email


# send welcome email everytime account is not active
@receiver(post_save, sender = UserAccount)
def _send_activate_email(sender, instance, **kwargs):
    if not instance.is_active:
        try: ActivateUserToken.objects.get(user = instance).delete()
        except ActivateUserToken.DoesNotExist: pass
        token = ActivateUserToken.objects.create(user = instance)
        # send_activate_email.delay(activate_token_pk = token.pk)