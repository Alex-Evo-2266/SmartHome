from ..models import Device,ConfigDevice,Room,genId,ValueDevice

def devicestatus(id, type):
    dev = Device.objects.get(id=id)
    value = dev.valuedevice_set.all()
    for item in value:
        if item.type==type:
            return item.value
    return None

def setValueAtToken(address,value):
    # print(address,value)
    configs = ConfigDevice.objects.all()
    for item in configs:
        if item.address==address:
            print(item.device_id)
            print(item.type)
            print(value)
            deviceSetStatus(item.device_id,item.type,value)


def deviceSetStatus(id, type,value):
    try:
        if(not value):
            return None
        dev = Device.objects.get(id=id)
        # print("2")
        values = dev.valuedevice_set.all()
        for item in values:
            if item.type==type:
                item.value = value
                item.save()
                return value
        newvalue = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,value=value,type=type)
        newvalue.save()
        return value
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

    configs = ConfigDevice.objects.all()
    for item in configs:
        if a(item.address) and item.type!="base":
            arr.append(item.address)
    return arr
