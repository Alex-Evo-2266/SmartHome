import os

from .MQTTDevice import MQTTDevice as Mqtt
from .mqttConnect import mqttManager
from castom_moduls import ModelData

from castom_moduls import ModelData, DeviceData, TypeDevice
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from SmartHome.logic.server.modulesconfig import configManager

from .router import router

def installdepModule():
    os.system("poetry add paho-mqtt")

def getInfo():
    return ModelData(
        name="mqtt",
        dependencies=[],
        router=router,
        deviceType=[DeviceData(
            name="mqtt",
            deviceClass=Mqtt,
            typeDevices=["all"]
        )]
    )
    # return {
    #     "type":"device",
    #     "name":"mqtt",
    #     "devices":[{
    #         "class":Mqtt,
    #         "name":"mqtt",
    #         "typeDevices":["all"]
    #     },
    #     {
    #         "class":Mqtt,
    #         "name":"zigbee",
    #         "typeDevices":["all"]
    #     }]
    # }

def init():
    print("mqtt init")
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
        mqttManager.reconnect
    )
    mqttManager.connect()
    return getInfo()
