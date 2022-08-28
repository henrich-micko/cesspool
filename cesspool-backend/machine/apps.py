from django.apps import AppConfig
from django.conf import settings

import os


class MachineConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'machine'

    def ready(self):
        if os.environ.get('RUN_MAIN') and settings.MQTT_RUN:
            from . import mqtt
            mqtt.client.loop_start()