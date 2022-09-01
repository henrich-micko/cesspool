from platform import machine
from django.conf import settings
from paho.mqtt import client

from . import models


class MqttClient(client.Client):
    def __init__(self, host: str, port: int, topic: str, username: str, password: str) -> None:
        super().__init__(client_id = "", clean_session = True, userdata = None, protocol = client.MQTTv311, transport = "tcp")

        self.host_to_connect = host
        self.port_to_connect = port
        self.topic_to_subscribe = topic

        self.data = {} # machine_code: {level: flaot, percent: float, battery: float}
        self.fields = {
            "Level_Percent": "level_percent",
            "Level_Raw": "level",
            "Battery_Voltage": "battery"
        }

        self.tls_set()
        self.username_pw_set(username = username, password = password)
    
    def connect(self):
        super().connect(self.host_to_connect, self.port_to_connect, 10)

    def on_connect(self, client, userdata, flags, rc):
        print(f"Connected to '{self._host}' with result code [{rc}]")
        
        self.subscribe(self.topic_to_subscribe)

    def on_message(self, client, userdata, msg):
        topic, message = msg.topic, msg.payload.decode()

        topic_splited = topic.split("/")
        if len(topic_splited) != 2:
            return

        machine_code, field = topic_splited
        if field not in self.fields.keys():
            return
        
        if machine_code not in self.data.keys():
            self.data[machine_code] = {key: None for key in self.fields.keys()}

        try:
            value = float(message)
        except ValueError:
            return
        self.data[machine_code][field] = value
        is_full = all([item != None for item in self.data[machine_code].values()])

        if is_full:
            machine, created = models.Machine.objects.get_or_create(code = machine_code)
            if machine.mqtt:
                record = machine.record_set.create(
                    **{self.fields[field]: self.data[machine_code][field] for field in self.data[machine_code].keys()}
                )

                print(f"From: {self.data[machine_code]} created {record}")
            
            del self.data[machine_code]