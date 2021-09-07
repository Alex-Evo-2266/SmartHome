from .mqttDevice.connect import connect
import asyncio
from channels.layers import get_channel_layer
from smartHomeApi.logic.devices import giveDevices
from asgiref.sync import async_to_sync
import threading
import time

class Test(object):
    """docstring for test."""

    def __init__(self):
        self.arg = "arg"

    def gety(self):
        return self.arg


def sendDeviceData():
    type = "chat_devices"
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'chat_devices',
        {
        'type': 'chat_message',
        'message': {
            'device':giveDevices()
            }
        }
    )

def datasend():
    while True:
        time.sleep(6)
        sendDeviceData()


def start():
    connect()

    r = Test()
    print(r.gety())

    s = threading.Thread(target=datasend)
    s.daemon = True
    s.start()
