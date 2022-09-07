from celery import Celery
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cesspool_backend.settings")

app = Celery("cesspool_backend")
app.config_from_object("django.conf:settings", namespace ="CELERY")
app.autodiscover_tasks()