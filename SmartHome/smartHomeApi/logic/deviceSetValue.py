from ..models import Device,ConfigDevice,Room,genId
from ..classes.devicesArrey import DevicesArrey

devicesArrey = DevicesArrey()

# def confdecod(data):
#     arr2 = []
#     for element in data:
#         arr2.append(element.receiveDict())
#     return arr2

def setValue(id, type, value):
    print(id, type, value)
    try:
        item = Device.objects.get(id=id)
        deviceDect = devicesArrey.get(id)
        device = deviceDect["device"]

        e = device
        if(type=="modeTarget"):
            e.target_mode()
            return True
        if(type=="variable"):
            e.set_value(value)
        value = int(value)
        if(type=="value"):
            e.set_value(value)
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
    except Exception as e:
        print("set value error",e)
        return None
