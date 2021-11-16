from smartHomeApi.logic.deviceControl.BaseDeviceClass import BaseDevice

class Variable(BaseDevice):

    def __init__(self,*args, **kwargs):
        super().__init__(**kwargs)

    def get_device(self):
        return "variable"
