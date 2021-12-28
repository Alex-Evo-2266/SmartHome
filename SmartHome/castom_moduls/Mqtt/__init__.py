# from .MQTTDevice import MQTTDevice as Mqtt
from castom_moduls import ModelData

def getInfo():
    return ModelData(
        name="mqtt",
        dependencies=[]
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
    return getInfo()
