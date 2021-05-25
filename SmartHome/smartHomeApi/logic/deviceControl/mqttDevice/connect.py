from smartHomeApi.logic.config import GiveServerConfig

import paho.mqtt.client as mqtt

mqttClient = [None]

def connect():
    try:
        conf = GiveServerConfig()
        client = mqtt.Client()
        print(conf["mqttBroker"]+":"+conf["mqttBrokerPort"])
        client.username_pw_set(conf["loginMqttBroker"], conf["passwordMqttBroker"])
        client.connect(conf["mqttBroker"], int(conf["mqttBrokerPort"]))
        client.loop_start()
        mqttClient[0] = client
        return client
    except Exception as e:
        print("ex",e)


def getMqttClient():
    return mqttClient[0]

    # client.subscribe("lamp1-power")
    # client.publish("lamp1-power", "hi")
    # client.loop_forever()
