from rest_framework import serializers

from cesspool.models import CesspoolToUser, Record
from subscription.validators import validate_subscription
from utils.utils import getattr_by_path, is_history, get_group_by_name
from account.models import UserAccount


class CesspoolUsersField(serializers.ListField):
    def __init__(self, **kwargs):
        kwargs["child"] = serializers.EmailField()
        self.source_ = kwargs.pop("source_", None)
        super().__init__(**kwargs)

    def get_attribute(self, instance):
        if self.source_: cesspool_instance = getattr_by_path(instance, self.source_, None)
        else: cesspool_instance = instance
        if cesspool_instance == None: return None

        return [
            ctu.user.email 
            for ctu in CesspoolToUser.objects.filter(cesspool = cesspool_instance, is_super_owner = False)
        ]

    @staticmethod
    def save(cesspool, users):
        # filter so only allowed amount of users will be added
        max_owners = cesspool.subscription.max_owners
        if max_owners < len(users):
            users = users[0:max_owners]

        appended_users = []
        for user in users:
            user, user_created = UserAccount.objects.get_or_create(email = user)
            
            if user_created:
                user.is_active = False
                user.save()
            
            if not user.has_group("client"):
                group = get_group_by_name("client")
                if group != None: 
                    user.groups.add(group)

            CesspoolToUser.objects.get_or_create(cesspool = cesspool, user = user)
            appended_users.append(user.pk)

        CesspoolToUser.objects.exclude(user__pk__in = appended_users).exclude(is_super_owner = True).delete()


class SubscriptionField(serializers.CharField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.validators.append(
            validate_subscription
        )

    def get_attribute(self, instance):
        return instance.subscription.title
    

class LastRecordField(serializers.DictField):
    def __init__(self, *args, **kwargs):
        kwargs["read_only"] = True
        super().__init__(*args, **kwargs)

    def get_attribute(self, instance):
        from cesspool.records_api.serializers import RecordSerializer
        
        record = Record.objects.filter(cesspool = instance).last()
        if record == None:
            return None
        return RecordSerializer(instance = record).data


class CesspoolProblemsField(serializers.ListField):
    def __init__(self, *args, **kwargs):
        kwargs["read_only"] = True
        super().__init__(*args, **kwargs)

    def get_attribute(self, instance):
        return [
            problem.detail
            for problem in instance.doctor()
        ]
    

class CesspoolOwnerField(serializers.EmailField):
    def get_attribute(self, instance):
        from cesspool.models import CesspoolToUser
        owner = CesspoolToUser.objects.filter(is_super_owner = True, cesspool = instance).first()
        if not owner: return None
        return owner.user.email
    

class CesspoolIsSubsriptionExpired(serializers.BooleanField):
    def get_attribute(self, instance):
        return instance.subscription_expiration_date != None and is_history(instance.subscription_expiration_date, compare_as_date = True)
    

def cesspool_owner_repr(instance):
    cesspool_owner = instance.get_owner()
    return None if cesspool_owner == None else {
        "pk": cesspool_owner.pk,
        "email": cesspool_owner.email
    }