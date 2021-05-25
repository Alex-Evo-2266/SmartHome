# from smartHomeApi.logic.config import GiveServerConfig
# from smartHomeApi.serializers import ServerConfigSerializer
import json

from .mqttDevice.connect import connect
from smartHomeApi.logic.deviceValue import setValueAtToken,GetTopicks
from .mqttDevice.mqttScan import addTopic,getTopicksAll,ClearTopicks

def start():
    try:
        client = connect()
        client.on_connect = on_connect
        client.on_message = on_message
        client.subscribe("#")
    except Exception as e:
        print("ex",e)



def on_connect(client, userdata, flags, rc):
    # print("Connected with result code "+str(rc))
    topicks = GetTopicks()
    for item in topicks:
        # print(item)
        client.subscribe(item)

def on_message(client, userdata, msg):
    # print(msg.topic,str(msg.payload.decode('utf-8')))
    # print(msg.topic+" "+str(json.loads(msg.payload)))
    print("f")
    setValueAtToken(msg.topic,str(msg.payload.decode('utf-8')))
    addTopic(msg.topic,str(msg.payload.decode('utf-8')))
    print(getTopicksAll())
