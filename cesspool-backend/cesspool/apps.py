from django.apps import AppConfig


class CesspoolConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cesspool"

    def ready(self) -> None:
        import cesspool.signals