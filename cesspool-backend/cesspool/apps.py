from django.apps import AppConfig
from django.conf import settings
from os import environ


class CesspoolConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cesspool"

    def ready(self) -> None:
        import cesspool.signals
        from cesspool.mqtt import MqttClient

        is_mqtt_running = bool(int(environ.get("IS_MQTT_RUNNING", "0"), 0))
        if not is_mqtt_running and settings.USE_MQTT:
            client = MqttClient(
                host = settings.MQTT_HOST,
                port = settings.MQTT_PORT,
                topic = settings.MQTT_TOPIC,
                username = settings.MQTT_USERNAME,
                password = settings.MQTT_PASSWORD,
                interval_h = settings.MQTT_INTERVAL_H 
            )

            client.connect()
            client.loop_start()

            environ["IS_MQTT_RUNNING"] = "1"