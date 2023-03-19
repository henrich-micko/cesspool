from rest_framework.permissions import BasePermission
from cesspool.models import CesspoolToUser


def is_super_owner_of_cesspool(ctu_pk_field = "pk"):
    
    class IsSuperOwnerOFCesspool(BasePermission):
        def has_permission(self, request, view):
            pk = view.kwargs.get(ctu_pk_field, None)
            if pk == None: return False
            
            try: return CesspoolToUser.objects.get(pk = pk).is_super_owner
            except CesspoolToUser.DoesNotExist: return False

    return IsSuperOwnerOFCesspool