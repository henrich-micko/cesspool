from django.conf import settings
from paho.mqtt import client

from . import models

def on_connect(client, userdata, flags, rc):
    print(f"Connected to '{settings.MQTT_HOST}' with result code [{rc}]")
    client.subscribe(settings.MQTT_TOPIC)

def on_message(client, userdata, msg):
    topic, message = msg.topic, msg.payload
    
    topic_split = topic.split("/")
    if len(topic_split) != 2: return

    machine_code, field = topic_split
    if field not in ["Level_Percent", "Level_Raw", "Battery_Voltage"]:
        return

    machine = models.Machine.objects.get_or_create(machine_code = machine_code)
    record = machine.record_set.time_period(seconds = 30)

    if record == None:
        record = machine.record_set.create()

    value = message.decode()
    match field:
        case "Level_Percent": record.level_percent = int(value)
        case "Level_Raw": record.level = int(value)
        case "Battery_Voltage": record.battery = int(value)

    record.save()

client = client.Client(client_id = "", clean_session = True, userdata = None, protocol = client.MQTTv311, transport = "tcp")
client.on_connect = on_connect
client.on_message = on_message

client.tls_set()
client.username_pw_set(username = settings.MQTT_USERNAME, password = settings.MQTT_PASSWORD)

client.connect(settings.MQTT_HOST, settings.MQTT_PORT, 10)