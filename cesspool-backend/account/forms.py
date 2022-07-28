from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import UserAccount


class UserAccountCreationForm(UserCreationForm):

    class Meta:
        model = UserAccount
        fields = ["email"]


class UserAccountChangeForm(UserChangeForm):

    class Meta:
        model = UserAccount
        fields = ["email"]