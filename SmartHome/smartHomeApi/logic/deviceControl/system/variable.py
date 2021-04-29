from smartHomeApi.logic.deviceValue import devicestatus,deviceSetStatus
from ..mqttDevice.connect import connect

class Variable():

    def __init__(
    self,
    DeviceId: str = None,
    DeviceName: str = None,
    DeviceSystemName: str = None,
    DeviceInformation: str = None,
    DeviceType: str = None,
    DeviceTypeConnect: str = None,
    DeviceConfig: list = [],
    RoomId:str = None
    ):
        self.DeviceId = DeviceId
        self.DeviceName = DeviceName
        self.DeviceSystemName = DeviceSystemName
        self.DeviceInformation = DeviceInformation
        self.DeviceType = DeviceType
        self.DeviceTypeConnect = DeviceTypeConnect
        self.DeviceConfig = None
        self.RoomId = RoomId


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
