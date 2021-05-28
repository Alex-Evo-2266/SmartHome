import yaml
from SmartHome.settings import SERVER_CONFIG
from ..deviceControl.mqttDevice.connect import reconnect

def ServerConfigEdit(data):
    templates = None
    with open(SERVER_CONFIG) as f:
        templates = yaml.safe_load(f)

    mqtt = {
        "host":data["mqttBroker"],
        "port":data["mqttBrokerPort"],
        "user":data["loginMqttBroker"],
        "password":data["passwordMqttBroker"]
    }
    templates["mqttBroker"] = mqtt
    with open(SERVER_CONFIG, 'w') as f:
        yaml.dump(templates, f, default_flow_style=False)
    reconnect()
    return True
