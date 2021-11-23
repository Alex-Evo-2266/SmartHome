from smartHomeApi.logic.deviceControl.BaseDeviceClass import BaseDevice

def look_for_param(arr:list, val):
    for item in arr:
        if(item.name == val):
            return(item)
    return None

class Variable(BaseDevice):

    def __init__(self,*args, **kwargs):
        super().__init__(**kwargs)

    def get_device(self):
        return "variable"

    def set_value(self, name, status):
        value = look_for_param(self.values, name)
        if(value):
            if(value.type == "number"):
                if(int(status) > int(value.high)):
                    status = value.high
                if(int(status) < int(value.low)):
                    status = value.low
            value.set(status)
        return status
