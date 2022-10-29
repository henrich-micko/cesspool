from django.utils import timezone
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

from celery import shared_task
from celery.utils.log import get_task_logger

from .models import scan_problems
from datetime import datetime

from . import models
from account.models import UserAccount


logger = get_task_logger(__name__)

# used in 'scan_machine_actions' for check time now with actions.date
def time_minutes_equals_or_higher(datetime_a: datetime, datetime_b: datetime):
    return (
        datetime_a > datetime_b or
        datetime_a.year == datetime_b.year and 
        datetime_a.month == datetime_b.month and 
        datetime_a.minute == datetime_b.minute and
        datetime_a.second == datetime_b.second
    )

@shared_task
def scan_machine_actions(save = True):
    actions_models = [models.MachineDeleteAction, models.MachineDeleteRecordsAction]
    
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
def scan_machine_problems_and_send_email():
    for user in UserAccount.objects.all():
        problems = {}
        for machine in user.machine_set.filter(notification = True):
            machine_problems = scan_problems(machine)
            machine_erros = [problem for problem in machine_problems if problem.importance and not problem.is_sand]
            if not machine_erros:
                continue
            problems[machine] = machine_erros
        
        if not problems:
            continue

        html_content = render_to_string("machine/problems.html", context = {"machines": problems, "url": settings.FRONTEND_URL})

        # if settings.DEBUG:
        #     send_to = settings.EMAIL_HOST_USER
        # else:
        #     send_to = user.email

        send_to = user.email

        msg = EmailMessage("Problemy so zariadeniami", html_content, settings.EMAIL_HOST_USER, [send_to])
        msg.content_subtype = "html"
        
        try:
            msg.send()
        except:
            return

        for machine in problems.keys():
            for problem in problems[machine]:
                problem.is_sand = True
                problem.save()