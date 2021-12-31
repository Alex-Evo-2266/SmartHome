import os

from .ZigbeeDevice import ZigbeeDevice
from castom_moduls import ModelData

from castom_moduls import ModelData, DeviceData, TypeDevice
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from SmartHome.logic.server.modulesconfig import configManager
from castom_moduls.Mqtt.deviceValue import mqttvalue

# try:
#     from castom_moduls.Mqtt.deviceValue import mqttvalue
# except Exception as e:
#     raise


def installdepModule():
    pass

def getInfo():
    return ModelData(
        name="zigbee",
        dependencies=["mqtt"],
        router=None,
        deviceType=[DeviceData(
            name="zigbee",
            deviceClass=ZigbeeDevice,
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
    mqttvalue.addConnect("zigbee")
    return getInfo()
