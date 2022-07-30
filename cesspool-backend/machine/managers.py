from django.db.models import QuerySet


class RecordQuerySet(QuerySet):

    def get_level_average(self) -> int:
        output = 0
        for obj in self.query:
            output += obj.level
        return output/len(self.query)