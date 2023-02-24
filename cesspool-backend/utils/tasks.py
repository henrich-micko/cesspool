from django.conf import settings
from django.apps import apps
from django.utils import timezone

from celery import shared_task


@shared_task
def check_delete_models():
    acctual_time, time_diff = timezone.now(), timezone.timedelta(0)

    for model_path in settings.CHECK_DELETE_MODELS:
        model = apps.get_model(model_path)

        for instance in model.objects.all():
            if instance.delete_at == None: 
                continue

            if instance.delete_at - acctual_time <= time_diff:
                instance.delete_permanent()