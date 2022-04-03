from SmartHome.logic.device.BaseDeviceClass import BaseDevice
from SmartHome.logic.device.DeviceElement import DeviceElement
from moduls_src.services import get
from castom_moduls.Mqtt.settings import DEVICE_NAME
import json


def look_for_param(arr:list, val):
    for item in arr:
        if(item.name == val):
            return(item)
    return None

def look_for_by_topic(arr:list, val):
    for item in arr:
        if(item.address == val):
            return(item)
    return None

# def createValue()

class Device(BaseDevice):

    name=DEVICE_NAME

    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)
        self.update_value()

    def update_value(self, *args, **kwargs):
        if(self.valueType=="json"):
            data = dict()
            data[self.values[0].address] = ""
            data = json.dumps(data)
            get("Mqtt_MqttConnect").publish(self.coreAddress+"/get", data)

    def get_device(self):
        return True

    def set_value(self, name, status):
        super().set_value(name, status)
        message = ""
        val = look_for_param(self.values, name)
        if(val.type=="binary"):
            if(int(status)==1):
                message = val.high
            else:
                message = val.low
        elif(val.type=="number"):
            if(int(status)>int(val.high)):
                message = int(val.high)
            elif(int(status)<int(val.low)):
                message = int(val.low)
            else:
                message = int(status)
        else:
            message = status
        if(self.valueType=="json"):
            data = dict()
            data[val.address] = message
            data = json.dumps(data)
            get("Mqtt_MqttConnect").publish(self.coreAddress+"/set", data)
        else:
            alltopic = self.coreAddress + "/" + val.address
            get("Mqtt_MqttConnect").publish(alltopic, message)
