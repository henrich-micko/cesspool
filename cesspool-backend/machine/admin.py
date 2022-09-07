from django.contrib import admin
from django.db import models as django_models

from inspect import isclass

from . import models


tables = models.__all__

class RecordAdmin(admin.ModelAdmin):
    model = models.Record

    list_filter = [
        "machine",
    ]

    ordering = ["machine", "-date"]


for table in tables:
    if not isclass(table):
        continue
    if not issubclass(table, django_models.Model):
        continue
    if table._meta.abstract:
        continue

    if table == models.Record:
        admin.site.register(table, RecordAdmin)
    else:
        admin.site.register(table)