import os

from moduls_src.models_schema import ModelData, DeviceData, TypeDevice
from moduls_src.baseClassControll import BaseControllModule
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from SmartHome.logic.server.modulesconfig import configManager
from .zigbeeInputMessage import initManager, getManager as zigbeeInputMessage
from castom_moduls.Zigbee.router import routerInit

def installdepModule():
    pass


class ModuleControll(BaseControllModule):
    def start(self):
        try:
            from castom_moduls.Mqtt.deviceValue import getManager as getValue
            from castom_moduls.Mqtt.mqttConnect import getManager as getManagerConnect
            # from castom_moduls import modules
            # mqtt = modules["mqtt"]
        except Exception as e:
            return ModelData(
                name="zigbee",
                dependencies=["mqtt"],
                status=False
            )
        initManager()
        configManager.addConfig(
            ServerModuleConfigSchema(
                name="zigbee",
                fields=[
                    ServerModuleConfigFieldSchema(
                        name="topic",
                        value='zigbee2mqtt'
                    ),
                ]
            )
        )
        getValue().addConnect("zigbee")
        getManagerConnect().addcallback("zigbee",zigbeeInputMessage().decodTopic)
        return self.getInfo()

    def end(self):
        pass

    def restart(self):
        self.end()
        self.start()

    def getItems(self):
        from .ZigbeeDevice import ZigbeeDevice
        return {
        "devices":[DeviceData(
            name="zigbee",
            deviceClass=ZigbeeDevice,
            typeDevices=["all"]
        )]
        }

    def getInfo(self):
        return ModelData(
            name="zigbee",
            dependencies=["mqtt"],
        )

    def getRouter(self):
        return routerInit()
