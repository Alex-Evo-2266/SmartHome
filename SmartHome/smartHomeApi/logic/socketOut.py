from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def sendData(type:str, data:dict):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'chat_devices',
        {
        'type': 'chat_message',
        'message': {
            'type':type,
            'data':data
            }
        }
    )
