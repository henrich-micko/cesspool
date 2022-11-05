from django.apps import AppConfig
from django.conf import settings

import os

class MachineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'machine'

    def ready(self):
        if not settings.USE_MQTT:
            return
        
        is_mqtt_running = bool(int(os.environ.get("IS_MQTT_RUNNING", "0"), 0))
        print(is_mqtt_running)
        if not is_mqtt_running:
            from . import mqtt

            client = mqtt.MqttClient(
                host = settings.MQTT_HOST,
                port = settings.MQTT_PORT,
                topic = settings.MQTT_TOPIC,
                username = settings.MQTT_USERNAME,
                password = settings.MQTT_PASSWORD,
            )

            client.connect()
            client.loop_start()
            
            os.environ["IS_MQTT_RUNNING"] = "1"