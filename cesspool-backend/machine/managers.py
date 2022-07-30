from django.db.models import QuerySet
from datetime import date, timedelta


class RecordQuerySet(QuerySet):

    def get_level_average(self) -> int:
        output = 0
        for obj in self.all():
            output += obj.level
        return output/len(self.all())

    def get_year_period(self):
        today = date.today()
        output = self.filter(date__range = [today, today - timedelta(years = 1)])

        return output

    def get_month_period(self):
        today = date.today()
        output = self.filter(date__range = [today, today - timedelta(months = 1)])

        return output

    def get_day_period(self):
        today = date.today()
        output = self.filter(date__range = [today, today - timedelta(hours = 24)])

        return output