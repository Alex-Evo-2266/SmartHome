from smartHomeApi.logic.config import GiveServerConfig
from yeelight import discover_bulbs
from yeelight import Bulb,PowerMode
from miio import Device,Discovery,Yeelight as Lamp,PhilipsBulb
import json

from .mqttDevice.connect import connect
from smartHomeApi.logic.deviceValue import setValueAtToken,GetTopicks

def start():
    client = connect()
    client.on_connect = on_connect
    client.on_message = on_message
    try:
        bulb = Bulb("192.168.0.3")
        # bulb.set_power_mode(PowerMode.)
        # print(bulb.set_brightness(100))
        print(bulb)
        print(bulb.get_properties())
        print(bulb.get_capabilities()["support"])
        print(bulb.get_model_specs())
    except:
        print("d")

    devices = discover_bulbs()
    print(devices)
    # d = Discovery.discover_mdns()
    # print(str(d))
    # y = Lamp("192.168.0.2","c90bea48a5a5ff938393a9b5b1ad71d4")
    # y = Lamp("192.168.0.3","822dc07d3660422aef22c6cb11af3a25")
    # ydevice_info = y.info()
    # print(ydevice_info)
    # y.set_developer_mode(True)
    # print("L")
    # print(y,ydevice_info)
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
    topicks = GetTopicks()
    for item in topicks:
        print(item)
        client.subscribe(item)

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(json.loads(msg.payload)))
    setValueAtToken(msg.topic,str(json.loads(msg.payload)))
