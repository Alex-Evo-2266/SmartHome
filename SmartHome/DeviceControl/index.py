from smartHomeApi.logic.config import GiveServerConfig
import paho.mqtt.client as mqtt
from .mqttDevice.connect import connect

def start():
    client = connect()
    client.on_connect = on_connect
    client.on_message = on_message

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("lamp1-power")

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
