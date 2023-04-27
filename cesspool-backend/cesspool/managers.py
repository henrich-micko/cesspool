from django.db.models import QuerySet, Model
from django.utils.timezone import timedelta, datetime


class RecordQuerySet(QuerySet):

    def time_filter(self, **kwargs) -> QuerySet[Model]:
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
    
    def get_release_datetimes(self, min_level_diff: int = 20, to_compare: int = 3) -> QuerySet[Model]:
        output: list = []
        records_tc: list = []
        records_tc_avg_level_per: int = 0
        is_output_added: bool = False

        for record in self.order_by("date"):
            records_tc.append(record)
            if len(records_tc) > to_compare:
                del records_tc[0]

            new_records_tc_avg_level_per = sum([r.level_percent for r in  records_tc]) / to_compare
            
            if new_records_tc_avg_level_per > records_tc_avg_level_per + min_level_diff and is_output_added:
                del output[-1]

            # on release of cesspool
            print(record, new_records_tc_avg_level_per, records_tc_avg_level_per)

            if new_records_tc_avg_level_per < records_tc_avg_level_per - min_level_diff:
                records_tc_avg_level_per = record.level_percent
                output.append(record.date)   
                is_output_added = True
            else:
                records_tc_avg_level_per = new_records_tc_avg_level_per
                is_output_added = False

        return output