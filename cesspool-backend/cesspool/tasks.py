from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.utils.translation import gettext as _

from celery import shared_task
from celery.utils.log import get_task_logger

from cesspool.models import Cesspool, CesspoolToUser
from account.models import UserAccount


logger = get_task_logger(__name__)


@shared_task
def send_admin_cesspool_problems():
    problems, problems_exists = {}, False
    for cesspool in Cesspool.objects.all():
        cesspool_problems =  [p for p in cesspool.doctor() if not p.is_sand]
        if cesspool_problems:
            problems[cesspool] = cesspool_problems
            problems_exists = True

    if not problems_exists:
        return

    html_content = render_to_string(
        template_name = "cesspool/problems_email.html",
        context = {
            "cesspool_problems": problems,
            "url": settings.REACT_HOST
        }
    )
    send_to = UserAccount.objects.filter(groups__name = "admin")
    email_message = EmailMessage(_("Admin žumpy - problémy"), html_content, settings.EMAIL_HOST_USER, [i.email for i in send_to])

    email_message.content_subtype = "html"
    if settings.USE_EMAIL:
        email_message.send()

    # mark as sand
    for cesspool_problems in problems.values():
        for problem in cesspool_problems:
            problem.is_sand = True
            problem.save()


@shared_task
def send_client_ctu_notf():
    data, data_exists = {}, False
    for user in UserAccount.objects.filter(groups__name = "client"):
        for ctu in CesspoolToUser.objects.filter(user = user): 
            ctu_notf_to_send = [n for n in ctu.doctor() if not n.is_sand]
            if ctu_notf_to_send: 
                data[user] = data.get(user, {})
                data[user][ctu] = ctu_notf_to_send
                data_exists = True
            
    if not data_exists:
        return
    
    for user in data.keys():
        html_content = render_to_string(
            template_name = "cesspool/ctu_notf_email.html",
            context = {
                "ctu_notf": data[user],
                "url": settings.REACT_HOST
            }
        )

        email_message = EmailMessage(_("Vaše žumpy"), html_content, settings.EMAIL_HOST_USER, [user])
        email_message.content_subtype = "html"
        
        if settings.USE_EMAIL:
            email_message.send()

        # mark as sand
        for user in data.keys():
            for ctu in data[user].keys():
                for p in data[user][ctu]:
                    p.is_sand = True
                    p.save()