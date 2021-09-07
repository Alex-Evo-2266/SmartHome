
def getParams(d:dict, param:str, default=None):
    if(param in d):
        return d[param]
    else:
        return default

class DeviceElement(object):
    """docstring for DeviceElement."""

    def __init__(self, *args, **kwargs):
        self.name = getParams(kwargs, "name")
        self.address = getParams(kwargs, "address")
        self.control = getParams(kwargs, "control")
        self.high = getParams(kwargs, "high")
        self.low = getParams(kwargs, "low")
        self.icon = getParams(kwargs, "icon")
        self.type = getParams(kwargs, "type")
        self.unit = getParams(kwargs, "unit")
        self.values = getParams(kwargs, "values")
        self.value = getParams(kwargs, "value")

    def getDict(self):
        return {
        "name": self.name,
        "address": self.address,
        "control": self.control,
        "high": self.high,
        "low": self.low,
        "icon": self.icon,
        "type": self.type,
        "unit": self.unit,
        "values": self.values,
        "value": self.value,
        }
