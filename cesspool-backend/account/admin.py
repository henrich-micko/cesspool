from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from . import models, forms


class UserAccountAdmin(UserAdmin):
    model = models.UserAccount

    add_form = forms.UserAccountCreationForm
    form = forms.UserAccountChangeForm
    
    list_display = [
        "email",
        "is_staff",
        "is_active",
        "delete_at",
    ]

    list_filter = [
        "email",
        "is_staff",
        "is_active"
    ]

    fieldsets = [
        ["User Login", {"fields": ["email", "password"]}],
        ["User Status", {"fields": ["is_staff", "is_active", "user_permissions", "groups"]}]
    ]
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', )}
        ),
    )

    add_fieldsets = [
        ["User Login", {"classes": ["wide"], "fields": ["email", "password1", "password2"]}],
        ["User Status", {"classes": ["wide"], "fields": ["is_staff", "is_active", "groups", "user_permissions"]}]
    ]
    
    search_fields = ["email"]
    ordering = ["email"]


admin.site.register(models.ResetPasswordToken)
admin.site.register(models.ActivateUserToken)
admin.site.register(models.UserAccount, UserAccountAdmin)