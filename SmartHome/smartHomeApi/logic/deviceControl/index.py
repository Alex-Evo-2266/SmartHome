from .mqttDevice.connect import connect
import asyncio
from channels.layers import get_channel_layer
from smartHomeApi.logic.getDevices import giveDevices
from asgiref.sync import async_to_sync
import threading
import time
from smartHomeApi.classes.devicesArrey import DevicesArrey

devicesArrey = DevicesArrey()


def saveData():
    devices = devicesArrey.all()
    for item in devices:
        dev = item["device"]
        dev.save()

def datasave():
    while True:
        time.sleep(120)
        saveData()

def sendDeviceData():
    type = "chat_devices"
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'chat_devices',
        {
        'type': 'chat_message',
        'message': {
            'type':'devices',
            'data':giveDevices()
            }
        }
    )

def datasend():
    while True:
        time.sleep(6)
        sendDeviceData()


def start():
    connect()

    s = threading.Thread(target=datasend)
    s.daemon = True
    s.start()

    s2 = threading.Thread(target=datasave)
    s2.daemon = True
    s2.start()
