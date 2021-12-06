from ..Device import Devices
from .DeviceElement import DeviceElement

def look_for_param(arr:list, val):
    for item in arr:
        if(item.name == val):
            return(item)
    return None

class BaseDevice(object):
    """docstring for BaseDevice."""

    def __init__(self, *args, **kwargs):
        self.systemName = kwargs["systemName"]
        deviceData = Devices.get(systemName=self.systemName)
        self.status = deviceData.status
        self.name = deviceData.name
        self.coreAddress = deviceData.address
        self.token = deviceData.token
        self.info = deviceData.information
        self.type = deviceData.type
        self.typeConnect = deviceData.typeConnect
        self.valueType = deviceData.valueType
        self.values = []
        self.device = None
        for item in deviceData.values:
            self.values.append(DeviceElement(**item.get(), deviceName=self.systemName))

    def get_value(self, name):
        value = look_for_param(self.values, name)
        return value.getDict()

    def get_values(self):
        res = []
        for item in self.values:
            res.append(item.getDict())
        return res

    def get_device(self):
        return self.device

    def set_value(self, name, status):
        value = look_for_param(self.values, name)
        if(value):
            if(value.type == "number"):
                if(int(status) > int(value.high)):
                    status = value.high
                if(int(status) < int(value.low)):
                    status = value.low
            value.set(status, False)
        return status

    # def update_value(self, *args, **kwargs):


    def save(self):
        dev = Devices.get(systemName=self.systemName)
        for item in self.values:
            print("save list")
            # ValueListDevice.objects.create(id=genId(ValueListDevice.objects.all()),name=item.name,value=value.get(),device=dev)
        for item in dev.values:
            value = look_for_param(self.values, item.name)
            if(value):
                item.value = value.get()
        dev.save()
        print("save",self.name)

    def get_Base_Info(self):
        res = {
        "address": self.coreAddress,
        "information": self.info,
        "name": self.name,
        "status": self.status,
        "systemName":self.systemName,
        "token":self.token,
        "type":self.type,
        "typeConnect": self.typeConnect,
        "RoomId": None,
        "valueType":self.valueType,
        }
        values = []
        vals = dict()
        for item in self.values:
            values.append(item.getDict())
            vals[item.name] = item.get()
        res["config"] = values
        res["value"] = vals
        return res

    def get_All_Info(self):
        return self.get_Base_Info()
