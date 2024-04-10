import logging
from pydantic import BaseModel
from typing import Any, List
from app.ingternal.device.schemas.device import DeviceSchema

logger = logging.getLogger(__name__)

class DevicesDataArreyItem(BaseModel):
	id:str
	device: DeviceSchema

class DevicesDataArrey():
    devices_data:List[DevicesDataArreyItem] = []

    @classmethod
    def add(cls, id:str, device:DeviceSchema):
        for item in cls.devices_data:
            if(item.id==id):
                return None
        cls.devices_data.append(DevicesDataArreyItem(id=id, device=device))
        return cls.devices_data

    @classmethod
    def all(cls):
        return cls.devices_data

    @classmethod
    def delete(cls, id:str):
        try:
            for item in cls.devices_data:
                if(item.id==id):
                    ret = item
                    cls.devices_data.pop(cls.devices_data.index(item))
                    return ret
            return None
        except Exception as e:
            logger.error(f"delete device from device list. {e}")
            return None

    @classmethod
    def get(cls, id:str)->DeviceSchema|None:
        for item in cls.devices_data:
            if(item.id==id):
                return item.device
        return None

