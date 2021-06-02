from ..models import Device,Room,genId
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
        # item = Device.objects.get(id=id)
        deviceDect = devicesArrey.get(id)
        device = deviceDect["device"]

        e = device
        if(type=="modeTarget"):
            e.target_mode()
            return True
        if(type=="variable"):
            e.set_value(value)
            return True
        if(type=="value"):
            e.set_value(int(value))
            return True

        e.set_status(type,value)
        return True
    except Exception as ex:
        print("set value error",ex)
        return None
