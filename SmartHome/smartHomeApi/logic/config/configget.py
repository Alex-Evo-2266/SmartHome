from SmartHome.settings import SERVER_CONFIG
import yaml
from ..Cart import getPages

def readConfig():
    templates = None
    with open(SERVER_CONFIG) as f:
        templates = yaml.safe_load(f)
    return templates

def getConfig(key):
    try:
        templates = None
        with open(SERVER_CONFIG) as f:
            templates = yaml.safe_load(f)
        return templates[key]
    except Exception as e:
        print(e)



def GiveServerConfig():
    try:
        templates = None
        with open(SERVER_CONFIG) as f:
            templates = yaml.safe_load(f)
        mqttBroker = templates["mqttBroker"]
        zigbeeBroker = templates["zigbee2mqtt"]
        mail = templates["mail"]
        retPages = getPages()
        server={
            "mqttBroker":mqttBroker["host"],
            "mqttBrokerPort":mqttBroker["port"],
            "loginMqttBroker":mqttBroker["user"],
            "passwordMqttBroker":mqttBroker["password"],
            "zigbee2mqttTopic":zigbeeBroker["topic"],
            "emailLogin":mail["login"],
            "emailPass":mail["password"],
            "pages":retPages["data"]
        }
        return server
    except Exception as e:
        return {
        "mqttBroker":"0.0.0.0",
        "mqttBrokerPort":"1883",
        "loginMqttBroker":"admin",
        "passwordMqttBroker":"admin",
        "zigbee2mqttTopic":"zigbee2mqtt",
        "emailLogin":'',
        "emailPass":'',
        "pages":[]
        }
