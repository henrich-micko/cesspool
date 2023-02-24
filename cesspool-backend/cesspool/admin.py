from django.contrib import admin

from cesspool import models


admin.site.register(models.Cesspool)
admin.site.register(models.CesspoolToUser)
admin.site.register(models.Record)