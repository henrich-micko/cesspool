from django.core.mail import EmailMessage
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.template.loader import render_to_string
from celery import shared_task
from celery.utils.log import get_task_logger

from utils.email import send_token_email
from account.models import ActivateUserToken, ResetPasswordToken


logger = get_task_logger(__name__)


@shared_task()
def send_activate_email(activate_token_pk):
    activate_token = ActivateUserToken.objects.get(pk = activate_token_pk)

    email_receiver = activate_token.user
    email_subject = _("Aktivovať účet")
    email_about = _(f"Bol vám vytvorený učet, ak ste si ho nestihli aktivovať prejdite na nášu stránku: http://{settings.WEBSITE}")
    token_link = f"http://{settings.WEBSITE}/account/activate/{activate_token.token}"

    if settings.USE_EMAIL: send_token_email(email_receiver, email_subject, email_about, token_link)
    else: logger.info(f"Email to {email_receiver} would be sand.")


@shared_task()
def send_reset_password_token_email(token_pk):
    token = ResetPasswordToken.objects.get(pk = token_pk)

    if settings.USE_EMAIL:
        html_content = render_to_string("account/reset_password_email.html", context = {"website_reset_pass": settings.REACT_HOST + "/account/reset-password/" + token.token})
        send_to = token.user.email
        
        msg = EmailMessage("Restovanie hesla", html_content, settings.EMAIL_HOST_USER, [send_to])
        msg.content_subtype = "html"
        msg.send()
    
    else:
        logger.info(f"Send reset token reset password {token} to {token.user.email}")