from django.contrib import admin

from . import models


admin.site.register(models.Machine)
admin.site.register(models.Record)