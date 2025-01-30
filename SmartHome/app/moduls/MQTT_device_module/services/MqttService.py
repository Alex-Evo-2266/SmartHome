import asyncio
import paho.mqtt.client as mqtt
from app.ingternal.modules.classes.baseService import BaseService


class MqttService(BaseService):
    client = None
    
    @classmethod
    async def start(cls, broker="localhost", port=1883, topic="test/topic"):
        cls.client = mqtt.Client()
        cls.client.on_connect = cls.on_connect
        cls.client.on_message = cls.on_message
        cls.client.connect(broker, port, 60)
        cls.client.loop_start()
        cls.topic = topic
        print("MQTT Service started")

    @classmethod
    async def stop(cls):
        if cls.client:
            cls.client.loop_stop()
            cls.client.disconnect()
            cls.client = None
            print("MQTT Service stopped")

    @classmethod
    def on_connect(cls, client, userdata, flags, rc):
        print("Connected with result code ", rc)
        client.subscribe(cls.topic)

    @classmethod
    def on_message(cls, client, userdata, msg):
        print(f"Received message: {msg.payload.decode()} on topic {msg.topic}")
        cls.data[msg.topic] = msg.payload.decode()

    @classmethod
    def get_data(cls):
        return cls.data

    @classmethod
    def run_command(cls, topic, message):
        if not topic or not message:
            print("Error: Topic and message must be provided.")
            return
        if cls.client:
            cls.client.publish(topic, message)
            print(f"Sent message: {message} to topic {topic}")
