from smartHomeApi.logic.config.configget import GiveServerConfig
from smartHomeApi.logic.deviceValue import setValueAtToken,GetTopicks
from .mqttScan import addTopic,getTopicksAll,ClearTopicks

import paho.mqtt.client as mqtt

mqttClient = [None]

def connect():
    def on_message(client, userdata, msg):
        print(msg.topic,str(msg.payload.decode('utf-8')))
        setValueAtToken(msg.topic,str(msg.payload.decode('utf-8')))
        # addTopic(msg.topic,str(msg.payload.decode('utf-8')))
    try:
        conf = GiveServerConfig()
        client = mqtt.Client()
        client.username_pw_set(conf["loginMqttBroker"], conf["passwordMqttBroker"])
        client.connect(conf["mqttBroker"], int(conf["mqttBrokerPort"]))
        client.loop_start()
        mqttClient[0] = client
        client.on_message = on_message
        client.subscribe("#")
        return client
    except Exception as e:
        print("ex",e)


    # try:
    #     client = connect()
    #     client.on_message = on_message
    #     client.subscribe("#")
    # except Exception as e:
    #     print("ex",e)


# def on_connect(client, userdata, flags, rc):
#     # print("Connected with result code "+str(rc))
#     topicks = GetTopicks()
#     for item in topicks:
#         # print(item)
#         client.subscribe(item)
def desconnect():
    try:
        client = mqttClient[0]
        client.disconnect() # disconnect gracefully
        client.loop_stop()
    except Exception as e:
        print("worning",e)


def reconnect():
    desconnect()
    connect()

def getMqttClient():
    return mqttClient[0]

def publish(topic,message=""):
    client = mqttClient[0]
    client.publish(topic, message)
