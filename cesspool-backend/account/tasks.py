from django.utils import timezone

from celery import shared_task
from celery.utils.log import get_task_logger

from datetime import datetime

from . import models


logger = get_task_logger(__name__)

def time_minutes_equals_or_higher(datetime_a: datetime, datetime_b: datetime):
    return (
        datetime_a > datetime_b or
        datetime_a.year == datetime_b.year and 
        datetime_a.month == datetime_b.month and 
        datetime_a.minute == datetime_b.minute and
        datetime_a.second == datetime_b.second
    )

@shared_task
def scan_user_actions(save = True):
    actions_models = [models.AccountDeleteAction, models.AccountDeleteMachinesAction]
    
    actions = []
    for action_model in actions_models:
        for action in action_model.objects.all():
            actions.append(action)

    now = timezone.now()

    for action in actions:
        if time_minutes_equals_or_higher(now, action.date):
            try:
                action.run()
            except BaseException as error:
                if save:
                    raise error