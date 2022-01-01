import os
from .Yeelight import Yeelight
from moduls_src.models_schema import ModelData, DeviceData, TypeDevice
from moduls_src.baseClassControll import BaseControllModule

def installdepModule():
    os.system("poetry add yeelight")


class ModuleControll(BaseControllModule):
    def start(self):
        return self.getInfo()

    def end(self):
        pass

    def restart(self):
        self.end()
        self.start()

    def getInfo(self):
        return ModelData(
            name="yeelight",
            dependencies=[],
        )

    def getItems(self):
        return {
        "devices":[DeviceData(
            name="yeelight",
            deviceClass=Yeelight,
            typeDevices=["light"]
        )]
        }
