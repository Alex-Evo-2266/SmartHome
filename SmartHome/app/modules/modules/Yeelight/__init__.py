from app.modules.modules.Yeelight.devices.Yeelight import YeelightDevice
from app.modules.modules_src.modules import BaseModule


class Module(BaseModule):

    dependencies = [
    "yeelight",
    ]
