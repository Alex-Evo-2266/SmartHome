from pydantic import BaseModel
from typing import Any, List
from app.core.ports.interface.device_class import IDevice
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

class DevicesArrayItem(BaseModel):
	id:str
	device: Any

class DevicesArray():
    def __init__(self):
        self.devices:List[DevicesArrayItem] = []

    def add_device(self, id:str, device: IDevice):
        for item in self.devices:
            if(item.id==id):
                return None
        self.devices.append(DevicesArrayItem(id=id, device=device))
        return self.devices

    def all(self):
        return self.devices

    def delete(self, id:str):
        try:
            for item in self.devices:
                if(item.id==id):
                    ret = item
                    self.devices.pop(self.devices.index(item))
                    return ret
            return None
        except Exception as e:
            logger.error(f"delete device from device list. {e}")
            return None

    def get(self, id:str)->DevicesArrayItem|None:
        for item in self.devices:
            if(item.id==id):
                return item
        return None

