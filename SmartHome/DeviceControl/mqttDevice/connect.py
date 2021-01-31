from smartHomeApi.logic.config import GiveServerConfig
import paho.mqtt.client as mqtt

def connect():
    conf = GiveServerConfig()
    client = mqtt.Client()
    print(conf["mqttBroker"]+":"+conf["mqttBrokerPort"])
    client.username_pw_set(conf["loginMqttBroker"], conf["passwordMqttBroker"])
    client.connect(conf["mqttBroker"], int(conf["mqttBrokerPort"]))
    client.loop_start()
    return client

    # client.subscribe("lamp1-power")
    # client.publish("lamp1-power", "hi")
    # client.loop_forever()
