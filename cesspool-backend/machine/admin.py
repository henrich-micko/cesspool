from django.contrib import admin

from . import models


admin.site.register(models.Machine)

class RecordAdmin(admin.ModelAdmin):
    model = models.Record

    list_filter = [
        "machine",
    ]

    ordering = ["machine", "-date"]


admin.site.register(models.Record, RecordAdmin)