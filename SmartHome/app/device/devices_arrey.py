import logging
from pydantic import BaseModel
from typing import Any, List
# from app.device.device_class.interfaces.device_interface import IDevice

logger = logging.getLogger(__name__)


class DevicesArreyItem(BaseModel):
	id:str
	device: Any

class DevicesArrey():
    devices:List[DevicesArreyItem] = []

    @staticmethod
    def addDevice(id:str, device):
        for item in DevicesArrey.devices:
            if(item.id==id):
                return None
        DevicesArrey.devices.append(DevicesArreyItem(id=id, device=device))
        return DevicesArrey.devices

    @staticmethod
    def all():
        return DevicesArrey.devices

    @staticmethod
    def delete(id:str):
        try:
            for item in DevicesArrey.devices:
                if(item.id==id):
                    ret = item
                    DevicesArrey.devices.pop(DevicesArrey.devices.index(item))
                    return ret
            return None
        except Exception as e:
            logger.error(f"delete device from device list. {e}")
            return None

    @staticmethod
    def get(id:str)->DevicesArreyItem|None:
        for item in DevicesArrey.devices:
            if(item.id==id):
                return item
        return None

