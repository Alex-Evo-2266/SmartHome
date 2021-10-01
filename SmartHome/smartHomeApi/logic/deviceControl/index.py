from .mqttDevice.connect import connect
import asyncio
from smartHomeApi.logic.getDevices import giveDevices
import threading
import time
from smartHomeApi.logic.socketOut import sendData
from smartHomeApi.classes.devicesArrey import DevicesArrey
from smartHomeApi.logic.serverData import getServerData

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

def serverDataSend():
    while True:
        sendData('server',getServerData())
        time.sleep(30)

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
