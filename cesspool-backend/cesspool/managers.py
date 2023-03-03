from django.db.models import QuerySet, Model
from django.utils.timezone import timedelta


class RecordQuerySet(QuerySet):
    def time_period(self, **kwargs) -> QuerySet[Model]:
        record = self.last()
        if not record: 
            return RecordQuerySet(self.model, using = self._db).none()
        
        since = record.date - timedelta(**kwargs)
        return self.filter(date__range = [since, record.date])

    def last_by(self, key) -> QuerySet[Model]:
        output_dict: dict = {}

        for record in self.all():
            key_value = key(item = record)

            if not key_value in output_dict.keys(): output_dict[key_value] = record
            else: output_dict[key_value] = record

        return self.filter(id__in = [record.id for record in output_dict.values()])