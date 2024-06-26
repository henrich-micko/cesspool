from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.utils.timezone import timedelta

from cesspool.models import CesspoolToUser, Cesspool
from subscription.models import Subscription


# check if user has any other relations left
@receiver(post_delete, sender = CesspoolToUser)
def check_user_relations_on_delete(sender, instance, **kwargs):
    if not CesspoolToUser.objects.filter(user = instance.user):
        instance.user.delete(timedelta(minutes = 5))


@receiver(post_save, sender = CesspoolToUser)
def check_user_realtion_on_save(sender, instance, **kwargs):
    instance.user.delete_at = None
    instance.user.save()


@receiver(post_save, sender = Cesspool)
def cesspool_on_save(sender, instance, **kwargs):
    if not instance.debug_mode:
        instance.record_set.filter(created_on_debug_mode = True).delete()
    if not instance.subscription:
        instance.subscription = Subscription.objects.first()
        instance.save()