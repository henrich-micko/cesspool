from django.contrib.auth.base_user import BaseUserManager
from rest_framework.authtoken.models import Token


class UserAccountManager(BaseUserManager):
    def create_user(self, email: str, password: str, **extra_fields):
        if not email:
            raise ValueError("Email must be set.")
        email = self.normalize_email(email)

        user = self.model(email = email, **extra_fields)
        user.set_password(password)
        user.save()

        Token.objects.create(user = user)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is False:
            raise ValueError("Superuser must have is_staff = True.")

        if extra_fields.get("is_superuser") is False:
            raise ValueError("Superuser must have is_superuser = True.")

        return self.create_user(email, password, **extra_fields)