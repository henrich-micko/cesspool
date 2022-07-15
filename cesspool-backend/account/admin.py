from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from . import models, forms

# Register your models here.


class UserAccountAdmin(UserAdmin):
    model = models.UserAccount

    add_form = forms.UserAccountCreationForm
    form = forms.UserAccountChangeForm
    
    list_display = ('email', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(models.UserAccount, UserAccountAdmin)