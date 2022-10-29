from django.utils import timezone
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

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

@shared_task
def send_welcome_email(user_pk, token_pk):
    user = models.UserAccount.objects.get(pk = user_pk)
    token = models.ActivateUserToken.objects.get(pk = token_pk)

    html_content = render_to_string("account/welcome_email.html", context = {"user": user, "url": settings.FRONTEND_HOST + "account/activate/" + token.token})
    send_to = user.email

    msg = EmailMessage("Bol Vám vytvorený učet na žumpomer.sk", html_content, settings.EMAIL_HOST_USER, [send_to])
    msg.content_subtype = "html"
    
    msg.send()

@shared_task
def send_reset_password_token_email(token_pk):
    token = models.ResetPasswordToken.objects.get(pk = token_pk)
    html_content = render_to_string("account/reset_password_email.html", context = {"url": settings.FRONTEND_HOST + "account/reset-password/" + token.token})

    send_to = token.user.email
    
    msg = EmailMessage("Restovanie hesla zumpomer.sk", html_content, settings.EMAIL_HOST_USER, [send_to])
    msg.content_subtype = "html"
    
    msg.send()