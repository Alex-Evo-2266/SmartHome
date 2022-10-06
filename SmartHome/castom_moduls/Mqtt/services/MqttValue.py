from settings import DEVICES

from datetime import datetime
import json
from SmartHome.logic.device.devicesArrey import devicesArrey
import logging

logger = logging.getLogger(__name__)

# def devicestatus(id, type):
#     dev = Device.objects.get(id=id)
#     value = dev.valuedevice_set.all()
#     for item in value:
#         if item.name==type:
#             return item.value
#     return None

class Service():
    def __init__(self):
        self.typeConnects = []

    def addConnect(self, name:str):
        for item in self.typeConnects:
            if item == name:
                return False
        self.typeConnects.append(name)
        return True

    def removeConnect(self, name:str):
        arr = self.typeConnects
        for item in arr:
            if item == name:
                self.typeConnects.remove(name)
                return

    def setValueAtToken(self, address,value):
        devices = devicesArrey.all()
        for item in devices:
            dev = item["device"]
            flag = True
            for connect in self.typeConnects:
                if dev.typeConnect == connect:
                    flag = False
                    break
            if(flag):
                continue
            if(dev.valueType=="json"):
                if(dev.coreAddress == address):
                    data = json.loads(value)
                    for key in data:
                        for item2 in dev.values:
                            if(item2.address==key):
                                self.deviceSetStatus(dev.systemName,item2.name,data[key])
            else:
                for item2 in dev.values:
                    if dev.coreAddress + '/' + item2.address==address:
                        return self.deviceSetStatus(dev.systemName,item2.name,value)


    def deviceSetStatus(self, systemName, type,value,script=True):
        try:
            if(value==None or type=="background"):
                return None
            dev = devicesArrey.get(systemName)
            dev = dev["device"]
            values = dev.values
            for item in values:
                if item.name==type:
                    if(item.type=="binary"):
                        if(str(value).lower()==str(item.high).lower()):
                            value = "1";
                        elif(str(value).lower()==str(item.low).lower()):
                            value = "0";
                        else:
                            return None
                    item.set(value)
            return value
        except Exception as e:
            logger.error(f'set value error. systemName:{systemName}, detail:{e}')
            return None
