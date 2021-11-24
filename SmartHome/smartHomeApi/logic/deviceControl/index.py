from .mqttDevice.connect import connect
import asyncio
from smartHomeApi.logic.getDevices import giveDevices
import threading
import time
from smartHomeApi.logic.socketOut import sendData
from smartHomeApi.classes.devicesArrey import DevicesArrey
from smartHomeApi.logic.serverData import getServerData
from smartHomeApi.logic.weather import updateWeather
from smartHomeApi.logic.runScript import runTimeScript

from miio import Device, Yeelight, Gateway, Discovery
# from miio.discovery import DEVICE_MAP
#
# print(DEVICE_MAP)

# dev = Device("192.168.0.2", "822dc07d3660422aef22c6cb11af3a25")

# def testConntec():
#     try:
#         dev = Gateway("192.168.0.6", "6f6e344a4d4f4e55787a68737537334e")
#         print(dev)
#         print(dev.info())
#         z = dev.get_properties(["status"])
#         print(z)
#     except Exception as e:
#         print("error",e)
#         testConntec()
# def testConntec():
#     try:
#         dev = Device("192.168.0.2", "822dc07d3660422aef22c6cb11af3a25")
#         print(dev)
#         k = dev.info().model
#         print(k)
#         c = None
#         if(k in DEVICE_MAP):
#             c = DEVICE_MAP[k]
#         print(c)
#     except Exception as e:
#         print("error",e)
#         testConntec()
#
# testConntec()

devicesArrey = DevicesArrey()

def datasave():
    while True:
        time.sleep(120)
        devices = devicesArrey.all()
        for item in devices:
            dev = item["device"]
            dev.save()

def datasend():
    while True:
        time.sleep(6)
        sendData('devices',giveDevices())

def weather():
    while True:
        updateWeather()
        time.sleep(43200)

def serverDataSend():
    while True:
        sendData('server',getServerData())
        time.sleep(30)

def TimeScriptActiv():
    while True:
        runTimeScript()
        time.sleep(60)

def start():
    connect()

    s = threading.Thread(target=datasend)
    s.daemon = True
    s.start()

    s2 = threading.Thread(target=datasave)
    s2.daemon = True
    s2.start()

    s3 = threading.Thread(target=serverDataSend)
    s3.daemon = True
    s3.start()

    s4 = threading.Thread(target=weather)
    s4.daemon = True
    s4.start()

    s5 = threading.Thread(target=TimeScriptActiv)
    s5.daemon = True
    s5.start()
