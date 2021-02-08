from ..models import Device,ConfigDevice,Room,genId
from DeviceControl.SmartHomeDevice import ControlDevices

def setValue(id, type, value):
    try:
        item = Device.objects.get(id=id)
        def confdecod(data):
            arr2 = []
            for element in data:
                arr2.append(element.receiveDict())
            return arr2
        e = ControlDevices(item.receiveDict(),confdecod(item.configdevice_set.all()))
        if(type=="power"):
            e.set_power(value)
        if(type=="dimmer"):
            e.set_dimmer(value)
        if(type=="temp"):
            e.set_temp(value)
        if(type=="color"):
            e.set_color(value)
        if(type=="mode"):
            e.set_mode(value)
        return True
    except :
        return None
