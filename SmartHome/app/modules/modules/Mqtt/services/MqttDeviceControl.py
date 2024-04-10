from app.ingternal.device.device_data.devices_arrey import DevicesArrey
from app.ingternal.device.device_class.BaseDeviceClass import BaseDevice
from app.ingternal.device.enums import ReceivedDataFormat
from ..exceptions.mqtt import DeviceClassAlreadyBeenRegisteredException

from app.modules.modules_src.services import BaseService

from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

class MqttDeviceControl(BaseService):
    classes = []

    @classmethod
    def add_connect(cls, name:str):
        for item in cls.classes:
            if item == name:
                raise DeviceClassAlreadyBeenRegisteredException()
        cls.classes.append(name)
        return True

    @classmethod
    def remove_connect(cls, name:str):
        arr = cls.classes
        for item in arr:
            if item == name:
                cls.classes.remove(name)
                return

    @classmethod
    def set_value_at_token(cls, address, value):
        devices = DevicesArrey.all()
        for item in devices:
            dev:BaseDevice = item.device
            if not (dev.class_device in cls.classes):
                continue
            if(dev.type_command==ReceivedDataFormat.JSON):
                if(dev.address == address):
                    data = json.loads(value)
                    for key in data:
                        for item2 in dev.values:
                            if(item2.address==key):
                                cls.device_set_status(dev.system_name, item2.name, data[key])
            else:
                for item2 in dev.values:
                    if dev.address + '/' + item2.address==address:
                        return cls.device_set_status(dev.system_name, item2.name, value)
                    

    @staticmethod
    def device_set_status(systemName, type, value, script=True):
        try:
            if(value==None or type=="background"):
                return None
            dev = DevicesArrey.get(systemName)
            dev:BaseDevice = dev.device
            values = dev.values
            for item in values:
                if item.name==type:
                    # if(item.type==TypeField.BINARY):
                    #     if(str(value).lower()==str(item.high).lower()):
                    #         value = "1"
                    #     elif(str(value).lower()==str(item.low).lower()):
                    #         value = "0"
                    #     else:
                    #         return None
                    print("p400")
                    item.set(value)
            return value
        except Exception as e:
            logger.error(f'set value error. systemName:{systemName}, detail:{e}')
            return None
