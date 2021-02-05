from miio import Device,Discovery,Yeelight,DeviceError,PhilipsBulb

def type_device(device):
    model = device.info().model
    type = model.split(".")[0]
    print(model.split("."))
    return type

def is_device(ip, token):
    print(ip, token)
    try:
        device = Device(ip,token)
        return {"type":"ok","data":device}
    except DeviceError as code:
        return {"type":"error","data":code}
