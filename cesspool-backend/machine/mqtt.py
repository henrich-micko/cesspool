from django.conf import settings
from paho.mqtt import client


def on_connect(client, userdata, flags, rc):
    print(f"Connected to '{settings.MQTT_HOST}' with result code [{rc}]")
    client.subscribe(settings.MQTT_TOPIC)

def on_message(client, userdata, msg):
    print(msg.topic, msg.payload)


client = client.Client(client_id = "", clean_session = True, userdata = None, protocol = client.MQTTv311, transport = "tcp")
client.on_connect = on_connect
client.on_message = on_message

client.tls_set()
client.username_pw_set(username = settings.MQTT_USERNAME, password = settings.MQTT_PASSWORD)

client.connect(settings.MQTT_HOST, settings.MQTT_PORT, 10)