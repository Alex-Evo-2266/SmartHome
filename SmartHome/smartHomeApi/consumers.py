
from .logic.devices import giveDevices
from .logic.config import GiveServerConfig

from asgiref.sync import sync_to_async
import json
from channels.generic.websocket import AsyncWebsocketConsumer

import datetime

class DeviceConsumer(AsyncWebsocketConsumer):
    now = datetime.datetime.now().second

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        print(self.room_group_name)


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        if self.room_group_name=="chat_devices" and message=="all":
            conf = await sync_to_async(GiveServerConfig)()
            sec = conf["updateFrequency"]
            nowtime = datetime.datetime.now().second
            udateTime = DeviceConsumer.now + sec
            DeviceConsumer.now = datetime.datetime.now().second
            if udateTime >= 60:
                udateTime = udateTime - 60
            if udateTime > 40 and nowtime < 20:
                udateTime = nowtime + sec
            print(DeviceConsumer.now,udateTime,nowtime)
            if udateTime > nowtime:
                print("error")
                return
            print("ok")
            return await self.channel_layer.group_send(
            self.room_group_name,
                {
                'type': 'chat_message',
                'message': await sync_to_async(giveDevices)()
                }
            )

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

# import json
# from asgiref.sync import async_to_sync
# from channels.generic.websocket import WebsocketConsumer
#
# class DeviceConsumer(WebsocketConsumer):
#     def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = 'chat_%s' % self.room_name
#
#         # Join room group
#         async_to_sync(self.channel_layer.group_add)(
#             self.room_group_name,
#             self.channel_name
#         )
#
#         self.accept()
#
#     def disconnect(self, close_code):
#         # Leave room group
#         async_to_sync(self.channel_layer.group_discard)(
#             self.room_group_name,
#             self.channel_name
#         )
#
#     # Receive message from WebSocket
#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']
#
#         if self.room_group_name=="chat_devices" and message=="all":
#             # print(giveDevices())
#             return async_to_sync(self.channel_layer.group_send)(
#                 self.room_group_name,
#                 {
#                     'type': 'chat_message',
#                     'message': giveDevices()
#                 }
#             )
#
#         # Send message to room group
#         async_to_sync(self.channel_layer.group_send)(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message
#             }
#         )
#
#     # Receive message from room group
#     def chat_message(self, event):
#         message = event['message']
#
#         # Send message to WebSocket
#         self.send(text_data=json.dumps({
#             'message': message
#         }))
