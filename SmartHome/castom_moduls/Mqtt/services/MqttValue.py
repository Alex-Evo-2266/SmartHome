from SmartHome.logic.device.devices_arrey import DevicesArrey
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from SmartHome.logic.deviceFile.schema import Received_Data_Format
from moduls_src.services import BaseService

from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

# def devicestatus(id, type):
#     dev = Device.objects.get(id=id)
#     value = dev.valuedevice_set.all()
#     for item in value:
#         if item.name==type:
#             return item.value
#     return None

class Mqtt_MqttValue(BaseService):
    typeConnects = []

    @staticmethod
    def addConnect(name:str):
        for item in Mqtt_MqttValue.typeConnects:
            if item == name:
                return False
        Mqtt_MqttValue.typeConnects.append(name)
        return True

    @staticmethod
    def removeConnect(name:str):
        arr = Mqtt_MqttValue.typeConnects
        for item in arr:
            if item == name:
                Mqtt_MqttValue.typeConnects.remove(name)
                return

    @staticmethod
    def setValueAtToken(address,value):
        devices = DevicesArrey.all()
        for item in devices:
            dev:BaseDevice = item.device
            flag = True
            for connect in Mqtt_MqttValue.typeConnects:
                if dev.device_data.class_device == connect:
                    flag = False
                    break
            if(flag):
                continue
            if(dev.device_data.value_type==Received_Data_Format.JSON):
                if(dev.device_data.address == address):
                    data = json.loads(value)
                    for key in data:
                        for item2 in dev.values:
                            if(item2.address==key):
                                Mqtt_MqttValue.deviceSetStatus(dev.device_data.system_name,item2.name,data[key])
            else:
                for item2 in dev.values:
                    if dev.device_data.address + '/' + item2.address==address:
                        return Mqtt_MqttValue.deviceSetStatus(dev.device_data.system_name,item2.name,value)


    @staticmethod
    def deviceSetStatus(systemName, type,value,script=True):
        try:
            if(value==None or type=="background"):
                return None
            dev = DevicesArrey.get(systemName)
            dev:BaseDevice = dev.device
            values = dev.values
            print("p0")
            for item in values:
                if item.name==type:
                    # if(item.type==TypeField.BINARY):
                    #     if(str(value).lower()==str(item.high).lower()):
                    #         value = "1"
                    #     elif(str(value).lower()==str(item.low).lower()):
                    #         value = "0"
                    #     else:
                    #         return None
                    item.set(value)
            return value
        except Exception as e:
            logger.error(f'set value error. systemName:{systemName}, detail:{e}')
            return None
