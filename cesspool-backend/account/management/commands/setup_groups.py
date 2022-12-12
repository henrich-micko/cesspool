from django.conf import settings
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Setup groups for users on db"

    def handle(self, *argv, **kwargs):
        user_groups = getattr(settings, "USER_GROUPS", {})
        for group_name in user_groups.keys():
            group, created = Group.objects.get_or_create(name = group_name)
            
            for perm_id in user_groups[group_name]:
                app_label, perm_name = perm_id.split(".")

                try:
                    perm = Permission.objects.get(
                        content_type__app_label = app_label, 
                        codename = perm_name
                    )

                except Permission.DoesNotExist:
                    self.stderr.write(f"Permission with code name {perm_name} doesnt exists in {app_label}.")
                    return

                group.permissions.add(perm)
            
            group.save()
        
        self.stdout.write("Groups created")