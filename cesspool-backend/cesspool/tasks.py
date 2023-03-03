from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.utils.translation import gettext as _

from celery import shared_task
from celery.utils.log import get_task_logger

from cesspool.models import Cesspool
from account.models import UserAccount


logger = get_task_logger(__name__)


@shared_task
def report_problems_to_admins():
    problems = {
        cesspool: cesspool.doctor()
        for cesspool in Cesspool.objects.all()
    }

    if settings.USE_EMAIL:
        logger.log(problems)
        return

    html = render_to_string(
        template_name = "cesspool/problems_email.html",
        context = {
            "problems": problems,
            "url": settings.REACT_HOST
        }
    )   

    email_message = EmailMessage(
        _("Problems with cesspools"), 
        settings.EMAIL_HOST_USER,
        UserAccount.objects.filter(is_staff = True)
    )

    email_message.content_subtype = "html"
    email_message.send()

