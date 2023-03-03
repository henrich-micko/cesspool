from django.contrib import admin

from cesspool import models


admin.site.register(models.Cesspool)
admin.site.register(models.CesspoolToUser)
admin.site.register(models.Record)
admin.site.register(models.CesspoolHightLevelNotif)
admin.site.register(models.CesspoolDeadBatteryProblem)
admin.site.register(models.CesspoolLowBatteryProblem)
admin.site.register(models.CesspoolNotRespondingProblem)