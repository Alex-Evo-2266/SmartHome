import yaml
from SmartHome.settings import SERVER_CONFIG
from ..deviceControl.mqttDevice.connect import reconnect

def ServerConfigEdit(data):
    mqtt = {
        "host":data["mqttBroker"],
        "port":data["mqttBrokerPort"],
        "user":data["loginMqttBroker"],
        "password":data["passwordMqttBroker"]
    }
    config = {"mqttBroker": mqtt}
    templates = None
    with open(SERVER_CONFIG, 'w') as f:
        yaml.dump(config, f, default_flow_style=False)
    reconnect()
    return True
