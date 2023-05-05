from cesspool.models import CesspoolToUser
from cesspool.serializers import CesspoolSerializer
from cesspool.serializer_fields import CesspoolUsersField, CesspoolIsSubsriptionExpired, cesspool_owner_repr
from account.models import UserAccount
from utils.serializer_fields import created_by_field_repr
from rest_framework.serializers import EmailField
from utils.utils import get_group_by_name



class CesspoolForAdminSerializer(CesspoolSerializer):
    owner = EmailField(read_only = False, required = False, allow_null = True)
    users = CesspoolUsersField(read_only = True)
    is_subsription_expirate = CesspoolIsSubsriptionExpired(read_only = True, required = False)

    class Meta(CesspoolSerializer.Meta):
        fields = [
            *CesspoolSerializer.Meta.fields, 
            "owner",
            "users",
            "is_subsription_expirate",
            "debug_mode",
            "created_by"
        ]
        
        extra_kwargs = {
            **CesspoolSerializer.Meta.extra_kwargs,
            "owner": { "ignore_on_save": True },
            "subscription_expiration_date": { "read_only": False },
            "debug_mode": { "read_only": False, "required": False },
            "created_by": { "read_only": True }
        }

    def on_create_and_update(self, instance, validated_data):
        owner = validated_data.pop("owner", None)
        if owner:
            user, created = UserAccount.objects.get_or_create(email = owner)
            if created:
                user.is_active = False
                user.save()

            if not user.has_group("client"):
                group = get_group_by_name("client")
                if group != None: 
                    user.groups.add(group)

            # delete old mf cause he is aint boss anymore
            try: CesspoolToUser.objects.get(cesspool = instance, is_super_owner = True).delete()
            except CesspoolToUser.DoesNotExist: pass
            
            ctu, _ = CesspoolToUser.objects.get_or_create(user = user, cesspool = instance)
            ctu.is_super_owner = True
            ctu.save()

        super().on_create_and_update(instance, validated_data)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["created_by"] = created_by_field_repr(instance)
        response["owner"] = cesspool_owner_repr(instance)
        return response