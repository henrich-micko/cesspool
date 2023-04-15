from django.contrib.auth.models import Group
from django.conf import settings

from account.serializers import UserAccountSerializer
from account.models import UserAccount


class UserAccountAdminSerializer(UserAccountSerializer):
    def on_create_and_update(self, instance: UserAccount, validated_data):
        groups = validated_data.pop("groups", None)

        if groups != None:
            groups_to_remove = [group.pk for group in instance.groups.all()] 

            for group_name in groups:
                try: group = Group.objects.get(name = group_name)
                except Group.DoesNotExist: continue

                instance.groups.add(group)

                # raise ValueError when not in the list
                try: groups_to_remove.remove(group.pk)
                except ValueError: pass 

            for gtr in groups_to_remove: instance.groups.remove(gtr)