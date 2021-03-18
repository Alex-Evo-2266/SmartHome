from miio import Device,Discovery,Yeelight,DeviceError,PhilipsBulb

def type_device(device):
    model = device.info().model
    type = model.split(".")[0]
    print(model.split("."))
    return type
