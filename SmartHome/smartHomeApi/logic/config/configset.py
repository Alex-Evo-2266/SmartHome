import yaml
from SmartHome.settings import SERVER_CONFIG
from ..deviceControl.mqttDevice.connect import reconnect,publish
from ..deviceControl.mqttDevice.mqttScan import ClearTopicks
from ..weather import updateWeather

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
    zigbee = {
        "topic":data["zigbee2mqttTopic"]
    }
    email = {
        "login":data["emailLogin"],
        "password":data["emailPass"]
    }
    weather = {
        "city":data["city"],
        "APPID":data["weatherKey"]
    }
    zigbee2mqttTopic = templates["zigbee2mqtt"]
    zigbee2mqttTopic = zigbee2mqttTopic["topic"]
    templates["mqttBroker"] = mqtt
    templates["zigbee2mqtt"] = zigbee
    templates["mail"] = email
    templates["weather"] = weather
    with open(SERVER_CONFIG, 'w') as f:
        yaml.dump(templates, f, default_flow_style=False)
    ClearTopicks()
    reconnect()
    publish(zigbee2mqttTopic + "/bridge/request/options",'{"options": {"mqtt": {"base_topic":"'+ data["zigbee2mqttTopic"] +'"}}}')
    updateWeather()
    return True
