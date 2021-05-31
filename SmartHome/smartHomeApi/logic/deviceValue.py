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

    print("g",address,value)
    devices = Device.objects.all()
    for item in devices:
        base_address = item.DeviceAddress
        if(item.DeviceValueType=="json"):
            if(base_address == address):
                data = json.loads(value)
                for key in data:
                    print("key",key)
                    for item2 in item.valuedevice_set.all():
                        print("address",item2.address)
                        if(item2.address==key):
                            deviceSetStatus(item.id,item2.type,data[key])

        else:
            for item2 in item.valuedevice_set.all():
                if base_address + '/' + item2.address==address:
                    return deviceSetStatus(item.id,item2.type,value)


def deviceSetStatus(id, type,value):
    try:
        print("set",type,value)
        if(value==None or type=="background"):
            return None
        dev = Device.objects.get(id=id)
        # print("2")
        values = dev.valuedevice_set.all()
        for item in values:
            print(item,value)
            if item.type==type:
                if(type=="power"):
                    value = str(value)
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
        typeControl = "boolean"
        if(type=="dimmer" or type=="color" or type=="temp"):
            typeControl = "range"
        if(type=="mode"):
            typeControl = "number"
        val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,type=type,typeControl=typeControl)
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
