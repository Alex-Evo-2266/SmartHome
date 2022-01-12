import os

from moduls_src.models_schema import ModelData, DeviceData, TypeDevice
from moduls_src.baseClassControll import BaseControllModule
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from SmartHome.logic.server.modulesconfig import configManager
from .zigbeeInputMessage import initManager as initMessageManager, getManager as zigbeeInputMessage
from moduls_src.managers import add
from castom_moduls.Zigbee.router import router
from .zigbeeCoordinatorManager import initManager as initControlManager

def installdepModule():
    pass


class ModuleControll(BaseControllModule):
    def start(self):
        try:
            from castom_moduls.Mqtt.deviceValue import getManager as getValue
            from castom_moduls.Mqtt.mqttConnect import getManager as getManagerConnect
        except Exception as e:
            return ModelData(
                name="zigbee",
                dependencies=["mqtt"],
                status=False
            )
        initMessageManager()
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

    def getPages(self):
        return None
        return{
        "name":"zigbee",
        "pages":[
            {
            "name": "zigbee",
            "src":"",
            "typeContent": "cards",
            "rootField": ".",
            "fields":[
                {
                    "name":{
                        "type":"text",
                        "value":"address"
                    },
                    "value":{
                        "type":"path",
                        "value":"."
                    }
                }
            ]
            }
        ]
        }

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
        from moduls_src.managers import add
        add("zigbeerouter",router)
        initControlManager()
        return "zigbeerouter"
