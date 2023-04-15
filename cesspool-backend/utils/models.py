from django.db import models
from django.utils import timezone

from datetime import timedelta


class ModelWithDeleteField(models.Model):
    delete_at = models.DateTimeField(null = True, blank = True)

    class Meta:
        abstract = True

    def delete(self, timedelta_ = timedelta(hours = 24)):
        self.delete_at = timezone.now() + timedelta_
        self.save()

    def delete_permanent(self):
        super().delete()


class Notification(models.Model):
    is_sand = models.BooleanField(default = False)

    class Meta:
        abstract = True