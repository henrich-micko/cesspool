from rest_framework.permissions import BasePermission


def has_user_permission(*permissions: str) -> BasePermission:
    output = []

    for perm in permissions:
        class PermissionClass(BasePermission):
            def has_permission(self, request, view):
                return request.user.has_perm(perm)
        output.append(PermissionClass)

    return output


def perm_or(*perms):

    class PermOr(BasePermission):
        def __init__(self, *argv, **kwargs):
            self.perms = [
                p(*argv, **kwargs)
                for p in perms
            ]

            super().__init__(*argv, **kwargs)
        
        def has_permission(self, request, view):
            for p in self.perms:
                if p.has_permission(request, view):
                    return True
            return False
        
    return PermOr