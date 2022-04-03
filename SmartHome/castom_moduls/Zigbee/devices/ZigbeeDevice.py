from castom_moduls.Mqtt.devices.MQTTDevice import Device as MQTTDevice
from castom_moduls.Zigbee.settings import DEVICE_NAME
# mqtt = modules["Mqtt"]
# def createValue()

class Device(MQTTDevice):
    name=DEVICE_NAME
