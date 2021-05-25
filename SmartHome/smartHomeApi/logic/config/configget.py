from SmartHome.settings import SERVER_CONFIG
import yaml

def GiveServerConfig():
    try:
        templates = None
        with open(SERVER_CONFIG) as f:
            templates = yaml.safe_load(f)
        mqttBroker = templates["mqttBroker"]
        server={
            "mqttBroker":mqttBroker["host"],
            "mqttBrokerPort":mqttBroker["port"],
            "loginMqttBroker":mqttBroker["user"],
            "passwordMqttBroker":mqttBroker["password"]
        }
        return server
    except Exception as e:
        return {"mqttBroker":"0.0.0.0","mqttBrokerPort":"1883","loginMqttBroker":"admin","passwordMqttBroker":"admin"}
