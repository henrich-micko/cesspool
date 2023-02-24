from rest_framework.permissions import BasePermission


def has_user_permission(*permissions: str) -> BasePermission:
    output = []

    for perm in permissions:
        class PermissionClass(BasePermission):
            def has_permission(self, request, view):
                return request.user.has_perm(perm)
        output.append(PermissionClass)

    return output