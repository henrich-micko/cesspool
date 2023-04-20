def created_by_field_repr(instance):
    return None if instance.created_by == None else {
        "pk": instance.created_by.pk,
        "email": instance.created_by.email,
    }
