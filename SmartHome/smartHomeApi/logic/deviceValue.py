from ..models import Device,Room,genId,ValueDevice
from .runScript import runScripts
import json

def devicestatus(id, type):
    dev = Device.objects.get(id=id)
    value = dev.valuedevice_set.all()
    for item in value:
        if item.type==type:
            return item.value
    return None

def setValueAtToken(address,value):
    # print(address,value)
    print("g")
    devices = Device.objects.all()
    for item in devices:
        base_address = item.DeviceAddress
        if(item.DeviceValueType=="json"):
            print(value)
            data = json.loads(value)
            for key in data:
                for item2 in item.valuedevice_set.all():
                    if(item2.address==key):
                        return deviceSetStatus(item.id,item2.type,data[key])
        else:
            for item2 in item.valuedevice_set.all():
                print(base_address + '/' + item2.address)
                print(address)
                if base_address + '/' + item2.address==address:
                    return deviceSetStatus(item.id,item2.type,value)


def deviceSetStatus(id, type,value):
    try:
        if(not value or type=="background"):
            return None
        dev = Device.objects.get(id=id)
        # print("2")
        values = dev.valuedevice_set.all()
        for item in values:
            print(item)
            if item.type==type:
                if(type=="power"):
                    if(value==item.high):
                        value="1"
                    elif(value==item.low):
                        value="0"
                    else:
                        return None
                if(item.value != value):
                    item.value = value
                    runScripts(id,type)
                    item.save()
                return value
        print('not value error')
        val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,type=type)
        val.value=value
        val.save()
        return True
    except Exception as e:
        print('set value error ',e)
        return None

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
