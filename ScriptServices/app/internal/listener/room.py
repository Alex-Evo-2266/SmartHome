# from .listener import LoadDataFanout
import asyncio
from app.internal.device.array.serviceDataPoll import roomDataPoll
from app.internal.script.serialize.parse_room_listener_data import parse_room_data
# rooms_listener = LoadDataFanout()

def setRoom(method, properties, body):
    print("rooms ", body)
    try:
        for data in body:
            asyncio.run(roomDataPoll.set_async(data["room_name"], parse_room_data(data)))
    except Exception as e:
        print("error", e)