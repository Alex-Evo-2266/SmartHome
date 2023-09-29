from settings import configManager
from castom_moduls.Mqtt.settings import CONFIG_NAME

from typing import Callable, Any
from moduls_src.services import BaseService, Services
from castom_moduls.Mqtt.src.mqttScan import TopicHistory
# from ..zigbee.zigbeeDevices import zigbeeInfoSearch
import paho.mqtt.client as mqtt
import logging, asyncio

logger = logging.getLogger(__name__)

class Mqtt_connect(BaseService):
    mqttClient = None
    callbacks = {}

    @staticmethod
    def get_history():
        return TopicHistory

    @staticmethod
    def addcallback(name: str, callback: Callable[[str, str],Any]):
        Mqtt_connect.callbacks[name] = callback

    @staticmethod
    def on_message(client, userdata, msg):
        try:
            logger.debug(f"mqtt message. topic:{msg.topic}, message:{str(msg.payload.decode('utf-8'))}")
            for item in Mqtt_connect.callbacks:
                f = Mqtt_connect.callbacks[item]
                asyncio.run(f(msg.topic,str(msg.payload.decode('utf-8'))))
            Services.get("Mqtt_MqttValue").setValueAtToken(msg.topic,str(msg.payload.decode('utf-8')))
            asyncio.run(TopicHistory.add(msg.topic,str(msg.payload.decode('utf-8'))))

            # zigbeeInfoSearch(msg.topic,str(msg.payload.decode('utf-8')))
        except Exception as e:
            logger.error(f'error reception mqtt message {e}')

    @staticmethod
    def connect():
        Services.get("Mqtt_MqttValue").addConnect("MqttDevice")
        try:
            logger.debug("mqtt conecting...")
            conf = configManager.getConfig(CONFIG_NAME)
            Mqtt_connect.mqttClient = mqtt.Client()
            Mqtt_connect.mqttClient.username_pw_set(conf["user"], conf["password"])
            Mqtt_connect.mqttClient.connect(conf["host"], int(conf["port"]))
            Mqtt_connect.mqttClient.loop_start()
            Mqtt_connect.mqttClient.on_message = Mqtt_connect.on_message
            Mqtt_connect.mqttClient.subscribe("#")
            logger.debug("mqtt conect")
            return Mqtt_connect.mqttClient
        except Exception as e:
            logger.error(f'error connecting to mqtt {e}')

    @staticmethod
    def desconnect():
        try:
            logger.debug("mqtt desconecting...")
            Mqtt_connect.mqttClient.disconnect() # disconnect gracefully
            Mqtt_connect.mqttClient.loop_stop()
            logger.debug("mqtt desconect")
        except Exception as e:
            logger.error(f'error mqtt desconnect {e}')

    @staticmethod
    def reconnect():
        Mqtt_connect.desconnect()
        Mqtt_connect.connect()

    @staticmethod
    async def reconnect_async():
        Mqtt_connect.desconnect()
        Mqtt_connect.connect()

    @staticmethod
    def getMqttClient():
        return Mqtt_connect.mqttClient

    @staticmethod
    def publish(topic,message=""):
        try:
            Mqtt_connect.mqttClient.publish(topic, message)
        except Exception as e:
            logger.error(f"error mqtt publish. ditail:{e}")
            raise
