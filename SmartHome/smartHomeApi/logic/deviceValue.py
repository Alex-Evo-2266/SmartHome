from ..models import Device,ConfigDevice,Room,genId,ValueDevice

def devicestatus(id, type):
    dev = Device.objects.get(id=id)
    value = dev.valuedevice_set.all()
    for item in value:
        if item.type==type:
            return item.value
    return None

def setValueAtToken(address,value):
    configs = ConfigDevice.objects.all()
    for item in configs:
        if item.address==address:
            deviceSetStatus(item.device_id,item.type,value)


def deviceSetStatus(id, type,value):
    try:
        dev = Device.objects.get(id=id)
        values = ValueDevice.objects.all()
        for item in values:
            if item.device_id==id and item.type==type:
                item.value = value
                item.save()
                return value
        newvalue = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,value=value,type=type)
        newvalue.save()
        return value
    except:
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
