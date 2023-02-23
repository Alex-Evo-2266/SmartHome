from typing import List
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from SmartHome.logic.deviceClass.DeviceMeta import DefConfig
from SmartHome.logic.deviceClass.Fields.base_field import BaseField
from SmartHome.logic.deviceFile.schema import Received_Data_Format
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice
import json
from moduls_src.services import Services

from moduls_src.models_schema import AddDevice, TypeAddDevice

def look_for_param(arr:List[BaseField], val):
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

class MqttDevice(BaseDevice):

    class Config(DefConfig):
        pass

    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)
        self.update_value()

    def update_value(self, *args, **kwargs):
        if self.device_data.value_type==Received_Data_Format.JSON:
            data = dict()
            data[self.values[0].address] = ""
            data = json.dumps(data)
            Services.get("Mqtt_connect").publish(self.device_data.address+"/get", data)

    def get_device(self):
        return True

    def set_value(self, name, status):
        super().set_value(name, status)
        message = ""
        val = look_for_param(self.values, name)
        if(val.type==TypeField.BINARY):
            message = status
            # if(int(status)==1):
            #     message = val.high
            # else:
            #     message = val.low
        elif(val.type==TypeField.NUMDER):
            if(int(status)>int(val.high)):
                message = int(val.high)
            elif(int(status)<int(val.low)):
                message = int(val.low)
            else:
                message = int(status)
        else:
            message = status
        if(self.device_data.value_type==Received_Data_Format.JSON):
            data = dict()
            data[val.address] = message
            data = json.dumps(data)
            print(self.device_data.address+"/set", data)
            Services.get("Mqtt_connect").publish(self.device_data.address+"/set", data)
        else:
            alltopic = self.device_data.address + "/" + val.address
            Services.get("Mqtt_connect").publish(alltopic, message)
