from SmartHome.logic.server.modulesconfig import configManager

from typing import Callable, Any
from .deviceValue import mqttvalue
from .mqttScan import TopicHistory
# from ..zigbee.zigbeeDevices import zigbeeInfoSearch

import paho.mqtt.client as mqtt
import logging, asyncio

logger = logging.getLogger(__name__)

class MqttManagerClass():
    def __init__(self):
        self.mqttClient = None
        self.callbacks = {}
        self.history = TopicHistory()

    def addcallback(self, name: str, callback: Callable[[str, str],Any]):
        self.callbacks[name] = callback

    def removecallbacks(self, name: str):
        self.callbacks[name] = callback

    def connect(self):
        mqttvalue.addConnect("mqtt")
        def on_message(client, userdata, msg):
            try:
                logger.debug(f"mqtt message. topic:{msg.topic}, message:{str(msg.payload.decode('utf-8'))}")
                for item in self.callbacks:
                    f = self.callbacks[item]
                    f(msg.topic,str(msg.payload.decode('utf-8')))
                mqttvalue.setValueAtToken(msg.topic,str(msg.payload.decode('utf-8')))
                asyncio.run(self.history.add(msg.topic,str(msg.payload.decode('utf-8'))))

                # zigbeeInfoSearch(msg.topic,str(msg.payload.decode('utf-8')))
            except Exception as e:
                logger.error(f'error reception mqtt message {e}')

        try:
            logger.debug("mqtt conecting...")
            conf = configManager.getConfig("mqttBroker")
            self.mqttClient = mqtt.Client()
            self.mqttClient.username_pw_set(conf["user"], conf["password"])
            self.mqttClient.connect(conf["host"], int(conf["port"]))
            self.mqttClient.loop_start()
            self.mqttClient.on_message = on_message
            self.mqttClient.subscribe("#")
            logger.debug("mqtt conect")
            return self.mqttClient
        except Exception as e:
            logger.error(f'error connecting to mqtt {e}')

    def desconnect(self):
        try:
            logger.debug("mqtt desconecting...")
            self.mqttClient.disconnect() # disconnect gracefully
            self.mqttClient.loop_stop()
            logger.debug("mqtt desconect")
        except Exception as e:
            logger.error(f'error mqtt desconnect {e}')

    def reconnect(self):
        self.desconnect()
        self.connect()


    def getMqttClient(self):
        return self.mqttClient

    def publish(self,topic,message=""):
        try:
            self.mqttClient.publish(topic, message)
        except Exception as e:
            logger.error(f"error mqtt publish. ditail:{e}")
            raise

    def getHistory(self):
        return self.history


mqttManager = MqttManagerClass()
