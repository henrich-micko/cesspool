from account.admin_api.serializers import UserAccountAdminSerializer
from account.models import UserAccount
from utils.permission import has_user_permission


class AccountAdminMixin:
    permissions = has_user_permission("account.manage_account")
    serializer_class = UserAccountAdminSerializer
    lookup_field = "pk"

    def get_queryset(self):
        created_by_filter = self.request.GET.get("created_by")
        queryset = UserAccount.objects.all()

        if created_by_filter != None:
            try: queryset = queryset.filter(created_by = int(created_by_filter))
            except ValueError: pass

        return queryset