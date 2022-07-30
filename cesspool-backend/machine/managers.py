from django.db.models import Manager, QuerySet


class MachineManager(Manager):
    
    def firstn(self, num: int) -> QuerySet:
        queryset = self.all()
        if num < len(queryset):
            queryset = queryset[0:num]
        return queryset

    def lastn(self, num: int) -> QuerySet:
        queryset = self.all().reverse()
        if num < len(queryset):
            queryset = queryset[0:num]
        return queryset