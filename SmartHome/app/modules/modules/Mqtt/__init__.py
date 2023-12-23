from app.modules.modules.Mqtt.devices.MQTTDevice import MqttDevice
# from castom_moduls.Mqtt.services.MqttValue import Mqtt_MqttValue
# from castom_moduls.Mqtt.services.MqttConnect import Mqtt_connect
from app.modules.modules_src.modules import BaseModule
# from moduls_src.services import Services
# from castom_moduls.Mqtt.settings import CONFIG_NAME
# from app.settings import configManager

class MqttModule(BaseModule):

    dependencies = [
    "paho-mqtt"
    ]

    # manager:Mqtt_connect = Services.get("Mqtt_connect")

    # @staticmethod
    # def start():
    #     configManager.addConfig(CONFIG_NAME,{
    #         "host":'localhost',
    #         "port": '1883',
    #         "user":'admin',
    #         "password":'admin'
    #     }, MqttModule.manager.reconnect_async)
    #     MqttModule.manager.connect()

    # @staticmethod
    # def end(self):
    #     self.manager.desconnect()
