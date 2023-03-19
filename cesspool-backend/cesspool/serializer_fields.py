from django.core.exceptions import ValidationError
from rest_framework import serializers

from cesspool.models import CesspoolToUser, Record
from account.validators import validate_user_with_permissions
from subscription.validators import validate_subscription
from utils.utils import getattr_by_path
from account.models import UserAccount


class CesspoolUsersField(serializers.ListField):
    def __init__(self, **kwargs):
        kwargs["child"] = serializers.EmailField()
        self.source_ = kwargs.pop("source_", None)
        super().__init__(**kwargs)

        self.validators.append(self._validate)


    def get_attribute(self, instance):
        cesspool_instance = getattr_by_path(instance, self.source_, None)
        if cesspool_instance == None: return None

        return [
            ctu.user.email 
            for ctu in CesspoolToUser.objects.filter(cesspool = cesspool_instance)
        ]
    
    @staticmethod
    def _validate(value):
        pass            


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
        from cesspool.serializers import RecordSerializer
        
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