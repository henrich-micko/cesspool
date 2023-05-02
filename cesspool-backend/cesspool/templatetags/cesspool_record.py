from django import template


register = template.Library()

def get_cesspool_record_field(value, field):
    return value.get_record(field)

register.filter("get_cesspool_record_field", get_cesspool_record_field)