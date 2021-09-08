from ..models import Device,Room,genId
from ..classes.devicesArrey import DevicesArrey
import threading

devicesArrey = DevicesArrey()

def setValue(id, type, value):
    print(id, type, value)
    try:
        deviceDect = devicesArrey.get(id)
        device = deviceDect["device"]
        e = device
        e.set_value(type,value)
        return True
    except Exception as ex:
        print("set value error",ex)
        return None
