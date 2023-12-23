from app.configuration.config import __module_config__
from ..settings import CONFIG_NAME, SERVICE_MQTT_PARS, DEVIECE_CLASS

from typing import Callable, Any
from app.modules.modules_src.services import BaseService, Services
from ..src.TopicMessagesList import TopicMessagesList
import paho.mqtt.client as mqtt
import logging, asyncio

logger = logging.getLogger(__name__)

class MqttConnect(BaseService):
    mqttClient = None
    callbacks = {}

    @classmethod
    def addcallback(cls, name: str, callback: Callable[[str, str],Any]):
        cls.callbacks[name] = callback

    @classmethod
    def on_message(cls, client, userdata, msg):
        try:
            print(f"mqtt message. topic:{msg.topic}, message:{str(msg.payload.decode('utf-8'))}")
            logger.debug(f"mqtt message. topic:{msg.topic}, message:{str(msg.payload.decode('utf-8'))}")
            for item in cls.callbacks:
                callback_function = cls.callbacks[item]
                asyncio.run(callback_function(msg.topic, str(msg.payload.decode('utf-8'))))
            Services.get(SERVICE_MQTT_PARS).set_value_at_token(msg.topic, str(msg.payload.decode('utf-8')))
            asyncio.run(TopicMessagesList.add(msg.topic, str(msg.payload.decode('utf-8'))))

            # zigbeeInfoSearch(msg.topic,str(msg.payload.decode('utf-8')))
        except Exception as e:
            logger.error(f'error reception mqtt message {e}')

    @classmethod
    def connect(cls):
        Services.get(SERVICE_MQTT_PARS).add_connect(DEVIECE_CLASS)
        try:
            logger.debug("mqtt conecting...")
            conf = __module_config__.get_config(CONFIG_NAME)
            cls.mqttClient = mqtt.Client()
            cls.mqttClient.username_pw_set(conf["user"], conf["password"])
            cls.mqttClient.connect(conf["host"], int(conf["port"]))
            cls.mqttClient.loop_start()
            cls.mqttClient.on_message = cls.on_message
            cls.mqttClient.subscribe("#")
            logger.debug("mqtt conect")
            return cls.mqttClient
        except Exception as e:
            logger.error(f'error connecting to mqtt {e}')

    @classmethod
    def desconnect(cls):
        try:
            logger.debug("mqtt desconecting...")
            cls.mqttClient.disconnect()
            cls.mqttClient.loop_stop()
            logger.debug("mqtt desconect")
        except Exception as e:
            logger.error(f'error mqtt desconnect {e}')

    @classmethod
    def reconnect(cls):
        cls.desconnect()
        cls.connect()

    @classmethod
    async def reconnect_async(cls):
        cls.desconnect()
        cls.connect()

    @classmethod
    def get_mqtt_client(cls):
        return cls.mqttClient
    
    @staticmethod
    def get_messages():
        return TopicMessagesList.get_topicks_and_linc()

    @classmethod
    def publish(cls, topic, message=""):
        try:
            cls.mqttClient.publish(topic, message)
        except Exception as e:
            logger.error(f"error mqtt publish. ditail:{e}")
            raise
