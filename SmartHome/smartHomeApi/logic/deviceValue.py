from ..models import Device,Room,genId,ValueDevice,ValueListDevice
from .runScript import runScripts
from datetime import datetime
import json
import threading

def devicestatus(id, type):
    dev = Device.objects.get(id=id)
    value = dev.valuedevice_set.all()
    for item in value:
        if item.name==type:
            return item.value
    return None

def setValueAtToken(address,value):
    devices = Device.objects.all()
    for item in devices:
        base_address = item.DeviceAddress
        if(item.DeviceValueType=="json"):
            if(base_address == address):
                data = json.loads(value)
                for key in data:
                    for item2 in item.valuedevice_set.all():
                        if(item2.address==key):
                            deviceSetStatusThread(item.id,item2.name,data[key])

        else:
            for item2 in item.valuedevice_set.all():
                if base_address + '/' + item2.address==address:
                    return deviceSetStatusThread(item.id,item2.name,value)

def deviceSetStatus(id, type,value,script=True):
    try:
        if(value==None or type=="background"):
            return None
        dev = Device.objects.get(id=id)
        values = dev.valuedevice_set.all()
        for item in values:
            if item.name==type:
                if(item.type=="binary"):
                    if(value==item.high):
                        value = "1";
                    elif(value==item.low):
                        value = "0";
                    else:
                        return None
                if(item.value != value):
                    try:
                        item.value = value
                        item.save()
                        # print("save",dev.DeviceName)
                        ValueListDevice.objects.create(id=genId(ValueListDevice.objects.all()),name=type,value=value,device=dev)
                    except Exception as e:
                        print('error write list',e)
                # print("active",dev.DeviceName)
                if(script):
                    runScripts(id,type)
                print("end",dev.DeviceName)
        return value
        print('not value error')
        return True
    except Exception as e:
        print('set value error ',e)
        return None

def deviceSetStatusThread(id, type,value,script=True):
    s = threading.Thread(target=deviceSetStatus, args=(id, type,value,script))
    s.daemon = True
    s.start()

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
