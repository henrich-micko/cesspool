from machine import models

machine = models.Machine.objects.create(code = "/")
machine.delete()