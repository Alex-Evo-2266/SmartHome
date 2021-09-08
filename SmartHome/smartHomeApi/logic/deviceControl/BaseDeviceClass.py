from smartHomeApi.models import Device,Room,genId,ValueDevice
from .DeviceElement import DeviceElement

def look_for_param(arr:list, val):
    for item in arr:
        if(item.name == val):
            return(item)
    return None

class BaseDevice(object):
    """docstring for BaseDevice."""

    def __init__(self, *args, **kwargs):
        self.id = kwargs["id"]
        deviceData = Device.objects.get(id=self.id)
        self.status = deviceData.DeviceStatus
        self.name = deviceData.DeviceName
        self.systemName = deviceData.DeviceSystemName
        self.coreAddress = deviceData.DeviceAddress
        self.token = deviceData.DeviceToken
        self.info = deviceData.DeviceInformation
        self.type = deviceData.DeviceType
        self.typeConnect = deviceData.DeviceTypeConnect
        self.valueType = deviceData.DeviceValueType
        self.values = []
        self.device = None
        values = deviceData.valuedevice_set.all()
        for item in values:
            self.values.append(DeviceElement(**item.toDict()))

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
            value.value = status

    def save(self):
        dev = Device.objects.get(id=self.id)
        values = dev.valuedevice_set.all()
        for item in values:
            value = look_for_param(self.values, item.name)
            if(value):
                item.value = value.value
                item.save()

    def get_Base_Info(self):
        res = {
        "DeviceAddress": self.coreAddress,
        "DeviceId": self.id,
        "DeviceInformation": self.info,
        "DeviceName": self.name,
        "DeviceStatus": self.status,
        "DeviceSystemName":self.systemName,
        "DeviceToken":self.token,
        "DeviceType":self.type,
        "DeviceTypeConnect": self.typeConnect,
        "RoomId": None,
        "DeviceValueType":self.valueType,
        }
        values = []
        vals = dict()
        for item in self.values:
            values.append(item.getDict())
            vals[item.name] = item.value
        res["DeviceConfig"] = values
        res["DeviceValue"] = vals
        return res

    def get_All_Info(self):
        return self.get_Base_Info()
