from ..models import Device,ConfigDevice,Room,genId

def devicestatus(id, type):
    dev = Device.objects.get(id=id)
    value = dev.valuedevice_set.all()
    print(value)
    for item in value:
        if item["type"]==type:
            return item["type"]
    return None
