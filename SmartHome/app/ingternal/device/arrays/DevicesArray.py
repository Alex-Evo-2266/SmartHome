import logging
from pydantic import BaseModel
from typing import Any, List
# from app.device.device_class.interfaces.device_interface import IDevice

logger = logging.getLogger(__name__)


class DevicesArrayItem(BaseModel):
	id:str
	device: Any

class DevicesArray():
    devices:List[DevicesArrayItem] = []

    @classmethod
    def add_device(cls, id:str, device):
        for item in cls.devices:
            if(item.id==id):
                return None
        cls.devices.append(DevicesArrayItem(id=id, device=device))
        return cls.devices

    @classmethod
    def all(cls):
        return cls.devices

    @classmethod
    def delete(cls, id:str):
        try:
            for item in cls.devices:
                if(item.id==id):
                    ret = item
                    cls.devices.pop(cls.devices.index(item))
                    return ret
            return None
        except Exception as e:
            logger.error(f"delete device from device list. {e}")
            return None

    @classmethod
    def get(cls, id:str)->DevicesArrayItem|None:
        for item in cls.devices:
            if(item.id==id):
                return item
        return None

