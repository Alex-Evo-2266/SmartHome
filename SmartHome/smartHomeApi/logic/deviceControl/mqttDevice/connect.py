from smartHomeApi.logic.config.configget import getConfig
from smartHomeApi.logic.deviceValue import setValueAtToken,GetTopicks
from .mqttScan import addTopic,getTopicksAll,ClearTopicks
from ..zigbee.zigbeeDevices import zigbeeInfoSearch

import paho.mqtt.client as mqtt
import logging

logger = logging.getLogger(__name__)

mqttClient = [None]

def connect():
    def on_message(client, userdata, msg):
        try:
            logger.debug(f"mqtt message. topic:{msg.topic}, message:{str(msg.payload.decode('utf-8'))}")
            setValueAtToken(msg.topic,str(msg.payload.decode('utf-8')))
            addTopic(msg.topic,str(msg.payload.decode('utf-8')))
            zigbeeInfoSearch(msg.topic,str(msg.payload.decode('utf-8')))
        except Exception as e:
            logger.error(f'error reception mqtt message {e}')

    try:
        logger.debug("mqtt conecting...")
        conf = getConfig("mqttBroker")
        client = mqtt.Client()
        client.username_pw_set(conf["user"], conf["password"])
        client.connect(conf["host"], int(conf["port"]))
        client.loop_start()
        mqttClient[0] = client
        client.on_message = on_message
        client.subscribe("#")
        logger.debug("mqtt conect")
        return client
    except Exception as e:
        logger.error(f'error connecting to mqtt {e}')

def desconnect():
    try:
        logger.debug("mqtt desconecting...")
        client = mqttClient[0]
        client.disconnect() # disconnect gracefully
        client.loop_stop()
        logger.debug("mqtt desconect")
    except Exception as e:
        logger.error(f'error mqtt desconnect {e}')


def reconnect():
    desconnect()
    connect()

def getMqttClient():
    return mqttClient[0]

def publish(topic,message=""):
    try:
        client = mqttClient[0]
        client.publish(topic, message)
    except Exception as e:
        logger.error(f"error mqtt publish. ditail:{e}")
        raise
