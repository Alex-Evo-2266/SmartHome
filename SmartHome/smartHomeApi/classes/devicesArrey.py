

class DevicesArrey():
    devices = []

    def __str__(self):
        return devices

    def addDevice(self,id,device):
        for item in DevicesArrey.devices:
            if(item["id"]==id):
                return None;
        DevicesArrey.devices.append({"id":id,"device":device})
        return DevicesArrey.devices

    def all(self):
        return DevicesArrey.devices

    def delete(self,id):
        try:
            for item in DevicesArrey.devices:
                if(item["id"]==id):
                    ret = item
                    DevicesArrey.devices.pop(DevicesArrey.devices.index(item))
                    return ret
            return None
        except Exception as e:
            print("error",e)
            return None

    def get(self,id):
        for item in DevicesArrey.devices:
            if(item["id"]==id):
                return item
        return None
