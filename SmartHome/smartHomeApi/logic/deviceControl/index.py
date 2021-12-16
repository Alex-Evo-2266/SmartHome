from .mqttDevice.connect import connect
import asyncio
from smartHomeApi.logic.getDevices import giveDevices
from smartHomeApi.logic.config.configget import getConfig
import threading
import time
import logging
from smartHomeApi.logic.socketOut import sendData
from smartHomeApi.classes.devicesArrey import DevicesArrey
from smartHomeApi.logic.serverData import getServerData
from smartHomeApi.logic.weather import updateWeather
from smartHomeApi.logic.runScript import runTimeScript

from miio import Device, Yeelight, Gateway, Discovery

devicesArrey = DevicesArrey()

logger = logging.getLogger(__name__)
logger.info("starting")

def datasave():
    while True:
        time.sleep(120)
        devices = devicesArrey.all()
        for item in devices:
            dev = item["device"]
            dev.save()

def datasend():
    while True:
        base = getConfig("base")
        time.sleep(int(base["frequency"]))
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
