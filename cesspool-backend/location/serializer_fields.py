def city_manager_repr_field(instance):
    return None if instance.manager == None else {
        "pk": instance.manager.pk,
        "email": instance.manager.email,
    }