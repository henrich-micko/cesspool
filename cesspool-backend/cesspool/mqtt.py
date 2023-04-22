from django.utils import timezone
from paho.mqtt import client
from cesspool.models import Cesspool
from cesspool.utils import battery_voltage_to_percent


class MqttClient(client.Client):
    LEVEL_PERCENT = "level_percent"
    LEVEL_M = "level_m"
    BATTERY_VOLTAGE = "battery_voltage"


    def __init__(self, host: str, port: int, topic: str, username: str, password: str, interval_h: int = 2) -> None:
        super().__init__(client_id = "", clean_session = True, userdata = None, protocol = client.MQTTv311, transport = "tcp")

        self.host_to_connect = host
        self.port_to_connect = port
        self.topic_to_subscribe = topic
        self.interval_h = interval_h

        self.data = {} # cesspool code: {level: flaot, percent: float, battery: float, mqtt_message: ""}
        self.fields = {
            "Level_Percent": self.LEVEL_PERCENT,
            "Level_Raw": self.LEVEL_M,
            "Battery_Voltage": self.BATTERY_VOLTAGE
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

        cesspool_code, field = topic_splited
        if field not in self.fields.keys():
            return
        
        if cesspool_code not in self.data.keys():
            self.data[cesspool_code] = {key: None for key in self.fields.keys()}
            self.data[cesspool_code]["mqtt_message"] = ""

        try:
            value = float(message)
        except ValueError:
            return
        
        self.data[cesspool_code][field] = value
        self.data[cesspool_code]["mqtt_message"] = self.data[cesspool_code]["mqtt_message"] + f"&&{topic}: {message}"

        is_full = all([item != None for item in self.data[cesspool_code].values()])

        if is_full:
            cesspool, created = Cesspool.objects.get_or_create(code = cesspool_code)
            cesspool_record_date = cesspool.get_record("date")
            rn = timezone.now()

            if cesspool.debug_mode or (
                cesspool.subscription and cesspool.subscription.mqtt and
                (cesspool_record_date == None or rn - cesspool_record_date > timezone.timedelta(hours = self.interval_h))):

                mqtt_message = f"[{rn}]:&&" + self.data[cesspool_code].pop("mqtt_message")
                battery = battery_voltage_to_percent(self.data[cesspool_code]["Battery_Voltage"])

                record = cesspool.record_set.create(
                    **{
                        self.fields[field]: self.data[cesspool_code][field] 
                        for field in self.data[cesspool_code].keys()
                    },

                    created_on_debug_mode = cesspool.debug_mode,
                    mqtt_message = mqtt_message if cesspool.debug_mode else None,
                    battery = battery
                )

                print(f"From: {self.data[cesspool_code]} created {record}")
            
            else:
                print(f"From: {self.data[cesspool_code]} not created...")

            del self.data[cesspool_code]