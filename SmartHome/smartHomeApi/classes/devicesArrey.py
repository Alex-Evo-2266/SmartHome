

class DevicesArrey():
    devices = []

    def addDevice(self,id,device):
        for item in DevicesArrey.devices:
            if(item["id"]==id):
                return None;
        DevicesArrey.devices.append({"id":id,"device":device})
        return DevicesArrey.devices

    def all(self):
        return DevicesArrey.devices

    def get(self,id):
        for item in DevicesArrey.devices:
            if(item["id"]==id):
                return item
        return None
