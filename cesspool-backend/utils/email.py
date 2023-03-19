from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string


def send_token_email(email_rec, subject, about, token_link):
    html_content = render_to_string("utils/token_email.html", context = { 
        "about": about, "token_link": token_link
    })

    email_m = EmailMessage(subject, html_content, settings.EMAIL_HOST_USER, [email_rec])
    email_m.content_subtype = "html"
    email_m.send()