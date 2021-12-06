from ..classes.devicesArrey import DevicesArrey

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
        print("set value error",id,ex)
        return None
