import paho.mqtt.client as mqtt
import logging
from app.ingternal.modules.classes.baseService import BaseService
from app.pkg import __config__
from ..settings import MQTT_PASSWORD, MQTT_BROKER_IP, MQTT_PORT, MQTT_USERNAME

logger = logging.getLogger(__name__)

class MqttService(BaseService):
    client = None
    data = {}

    @classmethod
    async def start(cls):
        try:
            broker = __config__.get(MQTT_BROKER_IP)
            port = __config__.get(MQTT_PORT)
            user = __config__.get(MQTT_USERNAME)
            password = __config__.get(MQTT_PASSWORD)

            # Логирование конфигурации
            logger.info(f"Connecting to broker {broker.value} on port {port.value}.")

            cls.client = mqtt.Client()
            cls.client.username_pw_set(user.value, password.value)
            cls.client.on_connect = cls.on_connect
            cls.client.on_message = cls.on_message

            cls.client.connect(broker.value, int(port.value), 60)
            cls.client.loop_start()

            logger.info("MQTT Service started")

        except Exception as e:
            logger.error(f"Failed to start MQTT Service: {e}")

    @classmethod
    async def restart(cls):
        try:
            logger.info("Restarting MQTT service...")
            await cls.stop()
            await cls.start()
        except Exception as e:
            logger.error(f"Failed to restart MQTT Service: {e}")

    @classmethod
    async def stop(cls):
        try:
            if cls.client:
                cls.client.loop_stop()
                cls.client.disconnect()
                cls.client = None
                logger.info("MQTT Service stopped")
        except Exception as e:
            logger.error(f"Failed to stop MQTT Service: {e}")

    @classmethod
    def on_connect(cls, client, userdata, flags, rc):
        logger.info(f"Connected with result code {rc}")
        if rc == 0:
            client.subscribe("#")
        else:
            logger.error(f"Connection failed with code {rc}")

    @classmethod
    def on_message(cls, client, userdata, msg):
        logger.info(f"Received message: {msg.payload.decode()} on topic {msg.topic}")
        cls.data[msg.topic] = msg.payload.decode()

    @classmethod
    def get_data(cls):
        return cls.data

    @classmethod
    def run_command(cls, topic, message):
        try:
            if not topic or not message:
                logger.error("Error: Topic and message must be provided.")
                return
            if cls.client:
                cls.client.publish(topic, message)
                logger.info(f"Sent message: {message} to topic {topic}")
            else:
                logger.error("Error: MQTT client not initialized.")
        except Exception as e:
            logger.error(f"Failed to send message: {e}")