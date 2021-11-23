from ..models import Device,Room,genId,ValueDevice,ValueListDevice
# from .runScript import runScripts
from datetime import datetime
import json
import threading
from ..classes.devicesArrey import DevicesArrey

devicesArrey = DevicesArrey()

def devicestatus(id, type):
    dev = Device.objects.get(id=id)
    value = dev.valuedevice_set.all()
    for item in value:
        if item.name==type:
            return item.value
    return None

def setValueAtToken(address,value):
    devices = devicesArrey.all()
    for item in devices:
        dev = item["device"]
        if(dev.typeConnect != "mqtt" and dev.typeConnect != "zigbee"):
            continue
        base_address = dev.coreAddress
        if(dev.valueType=="json"):
            if(base_address == address):
                data = json.loads(value)
                for key in data:
                    for item2 in dev.values:
                        if(item2.address==key):
                            deviceSetStatus(dev.id,item2.name,data[key])

        else:
            for item2 in dev.values:
                if base_address + '/' + item2.address==address:
                    return deviceSetStatus(dev.id,item2.name,value)

def deviceSetStatus(id, type,value,script=True):
    try:
        if(value==None or type=="background"):
            return None
        dev = devicesArrey.get(id)
        dev = dev["device"]
        values = dev.values
        for item in values:
            if item.name==type:
                if(item.type=="binary"):
                    print(item.name,value,item.high,item.low,str(value)==str(item.high))
                    if(str(value)==str(item.high)):
                        value = "1";
                    elif(str(value)==str(item.low)):
                        value = "0";
                    else:
                        return None
                item.set(value)
                # if(script):
                #     runScripts(id,type)
                print("end",dev.name)
        return value
        print('not value error')
        return True
    except Exception as e:
        print('set value error ',id,e)
        return None

# def deviceSetStatusThread(id, type,value,script=True):
#     s = threading.Thread(target=deviceSetStatus, args=(id, type,value,script))
#     s.daemon = True
#     s.start()

def GetTopicks():
    arr = []
    def a(str):
        for it in arr:
            if it==str:
                return False
        return True

    devices = Device.objects.all()
    for item in devices:
        base_address = item.DeviceAddress
        if(item.DeviceValueType=="json"):
            address = base_address
            if a(address):
                arr.append(address)
        else:
            for item2 in item.valuedevice_set.all():
                address = base_address + "/" + item2.address
                if a(address):
                    arr.append(address)
    return arr
