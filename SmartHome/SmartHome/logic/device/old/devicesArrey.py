import logging

logger = logging.getLogger(__name__)

class DevicesArrey():
    devices = []

    def __str__():
        return DevicesArrey.devices

    @staticmethod
    def addDevice(id,device):
        for item in DevicesArrey.devices:
            if(item["id"]==id):
                return None
        DevicesArrey.devices.append({"id":id,"device":device})
        return DevicesArrey.devices

    @staticmethod
    def all():
        return DevicesArrey.devices

    @staticmethod
    def delete(id):
        try:
            for item in DevicesArrey.devices:
                if(item["id"]==id):
                    ret = item
                    DevicesArrey.devices.pop(DevicesArrey.devices.index(item))
                    return ret
            return None
        except Exception as e:
            logger.error(f"delete device from device list. {e}")
            return None

    @staticmethod
    def get(id):
        for item in DevicesArrey.devices:
            if(item["id"]==id):
                return item
        return None

