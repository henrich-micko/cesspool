from django.db.models import QuerySet
from django.utils import timezone

from datetime import timedelta

class RecordQuerySet(QuerySet):

    def get_level_average(self) -> int:
        output = 0
        for obj in self.all():
            output += obj.level
        return output/len(self.all())

    def time_period(self, *argv, **kwargs):
        today = timezone.now()
        since = today - timedelta(*argv, **kwargs)
        return self.filter(date__range = [since, today])

    def year_period(self):
        return self.time_period(days = 365)

    def month_period(self):
        return self.time_period(months = 1)

    def day_period(self):
        return self.time_period(hours = 24)