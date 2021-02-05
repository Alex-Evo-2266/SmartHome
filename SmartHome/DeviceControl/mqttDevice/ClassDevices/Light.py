from DeviceControl.miioDevice.definition import is_device, type_device
class Light():

    def __init__(self, device):
        self.__device = device
        type = type_device(device)
        if(type!=="error"):
            self.__type = type
