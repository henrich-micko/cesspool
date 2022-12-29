from django.db import models
from django.utils import timezone

from datetime import timedelta


class ModelWithDeleteField(models.Model):
    delete_at = models.DateTimeField(null = True, blank = True)

    class Meta:
        abstract = True

    def delete(self):
        self.delete_at = timezone.now() + timedelta(hours = 24)
        self.save()

    def delete_permanent(self):
        super().delete()