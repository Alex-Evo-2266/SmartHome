from .mqttDevice.connect import connect
import asyncio
from channels.layers import get_channel_layer
from smartHomeApi.logic.devices import giveDevices
from asgiref.sync import async_to_sync
import threading
import time

def sendDeployments():
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
        sendDeployments()


def start():
    connect()

    s = threading.Thread(target=datasend)
    s.daemon = True
    s.start()
<<<<<<< HEAD
=======
    # loop = asyncio.get_event_loop()
    # loop.run_until__complete(test())
    # loop.close();
>>>>>>> df4dc7537ccd435d2595c8a8b01cc6e379a2d1c8
