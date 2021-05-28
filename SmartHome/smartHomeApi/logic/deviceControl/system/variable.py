from smartHomeApi.logic.deviceValue import devicestatus,deviceSetStatus
from ..mqttDevice.connect import connect

class Variable():

    def __init__(self,*args, **kwargs):
        self.DeviceId = kwargs["DeviceId"]
        self.DeviceName = kwargs["DeviceName"]
        self.DeviceSystemName = kwargs["DeviceSystemName"]
        self.DeviceInformation = kwargs["DeviceInformation"]
        self.DeviceType = kwargs["DeviceType"]
        self.DeviceTypeConnect = kwargs["DeviceTypeConnect"]
        self.DeviceConfig = None
        self.RoomId = kwargs["RoomId"]


    def get_properties(self, properties)->dict:
        d = dict()
        for item in properties:
            if(item == "value"):
                d = {**d,item:devicestatus(self.DeviceId, item)}
        return d

    def set_value(self,value):
        return deviceSetStatus(self.DeviceId,"value",value)

    def get_value(self):
        prop=[
        "value"
        ]
        return self.get_properties(prop)

    def controlDevice(self):
        return None

    def get_control(self):
        return {}
