import os

from .MQTTDevice import MQTTDevice as Mqtt

from moduls_src.models_schema import ModelData, DeviceData, TypeDevice
from moduls_src.baseClassControll import BaseControllModule
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from SmartHome.logic.server.modulesconfig import configManager
from .mqttConnect import initManager as initManagerCon
from .deviceValue import initManager as initManagerVal
from castom_moduls.Mqtt.router import routerInit

def installdepModule():
    os.system("poetry add paho-mqtt")



class ModuleControll(BaseControllModule):
    def start(self):
        self.manager = initManagerCon()
        initManagerVal()
        configManager.addConfig(
            ServerModuleConfigSchema(
                name="mqttBroker",
                fields=[
                    ServerModuleConfigFieldSchema(
                        name="host",
                        value='localhost'
                    ),
                    ServerModuleConfigFieldSchema(
                        name="port",
                        value='1883'
                    ),
                    ServerModuleConfigFieldSchema(
                        name="user",
                        value='admin'
                    ),
                    ServerModuleConfigFieldSchema(
                        name="password",
                        value='admin'
                    )
                ]
            ),
            self.manager.reconnect_async
        )
        self.manager.connect()
        return self.getInfo()

    def addcallback(self, name, callback):
        self.manager.addcallback(name,callback)


    def end(self):
        self.manager.desconnect()


    def restart(self):
        self.end()
        self.start()

    def getInfo(self):
        return ModelData(
            name="mqtt",
            dependencies=[],
        )

    def getItems(self):
        return {
        "devices":[DeviceData(
            name="mqtt",
            deviceClass=Mqtt,
            typeDevices=["all"]
        )]}

    def getRouter(self):
        return routerInit()
