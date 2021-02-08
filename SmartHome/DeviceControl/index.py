from smartHomeApi.logic.config import GiveServerConfig
from .mqttDevice.connect import connect
from yeelight import discover_bulbs
from yeelight import Bulb
from miio import Device,Discovery,Yeelight as Lamp,PhilipsBulb

def start():
    client = connect()
    client.on_connect = on_connect
    client.on_message = on_message
    bulb = Bulb("192.168.0.2")
    # c = bulb.turn_off()
    # print(type(bulb)==Bulb)
    print(bulb)
    print(bulb.get_properties())
    print(bulb.get_capabilities()["support"])
    print(bulb.get_model_specs())
    # devices = discover_bulbs()
    # print(devices)
    # d = Discovery.discover_mdns()
    # print(str(d))
    # y = Lamp("192.168.0.2","c90bea48a5a5ff938393a9b5b1ad71d4")
    # y = Device("192.168.0.10","48a53995b9dfa3d05961bc8d1940cdd9")
    # ydevice_info = y.info()
    # y.set_developer_mode(True)
    # print(y.status())
    # print(y.get_properties(["active_mode"]))
    # print(ydevice_info)
    # print(ydevice_info.model)
    # print(ydevice_info.firmware_version)
    # print(ydevice_info.hardware_version)
    # y.on(mode=5)
    # r = Device("192.168.0.2","c90bea48a5a5ff938393a9b5b1ad71d4")
    # device_info = r.info()
    # print(device_info.model.split("."))
    # print(device_info.firmware_version)
    # print(device_info.hardware_version)
    # print(y.get_properties(["ct"]))

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("lamp1-power")

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
