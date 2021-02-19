from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/smartHome/(?P<room_name>\w+)/$', consumers.DeviceConsumer.as_asgi()),
]
