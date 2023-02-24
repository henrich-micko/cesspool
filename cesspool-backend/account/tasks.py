from django.utils import timezone
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

from celery import shared_task
from celery.utils.log import get_task_logger

from datetime import datetime

from . import models


logger = get_task_logger(__name__)

@shared_task
def send_welcome_email(user_pk, token_pk):
    user = models.UserAccount.objects.get(pk = user_pk)
    token = models.ActivateUserToken.objects.get(pk = token_pk)

    if settings.USE_EMAIL:
        html_content = render_to_string("account/welcome_email.html", context = {"user": user, "website": settings.REACT_HOST, "website_activate": settings.REACT_HOST + "/account/activate/" + token.token})
        send_to = user.email

        msg = EmailMessage("Bol Vám vytvorený učet", html_content, settings.EMAIL_HOST_USER, [send_to])
        msg.content_subtype = "html"
        
        msg.send()
    
    else:
        logger.info(f"Send welcome email task activate token: {token} for user {user}")

@shared_task
def send_reset_password_token_email(token_pk):
    token = models.ResetPasswordToken.objects.get(pk = token_pk)

    if settings.USE_EMAIL:
        html_content = render_to_string("account/reset_password_email.html", context = {"website_reset_pass": settings.REACT_HOST + "/account/reset-password/" + token.token})
        send_to = token.user.email
        
        msg = EmailMessage("Restovanie hesla", html_content, settings.EMAIL_HOST_USER, [send_to])
        msg.content_subtype = "html"
        msg.send()
    
    else:
        logger.info(f"Send reset token reset password {token} to {token.user.email}")