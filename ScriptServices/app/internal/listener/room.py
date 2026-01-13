# from .listener import LoadDataFanout
import asyncio
# from app.internal.device.array.serviceDataPoll import roomDataPoll
# from app.internal.script.serialize.parse_room_listener_data import parse_room_data
from app.internal.run_script.context_store import context
from app.internal.run_script.context_build import build_room_context
# rooms_listener = LoadDataFanout()
from app.internal.logs import MyLogger

logger = MyLogger().get_logger(__name__)

def setRoom(method, properties, body):
    logger.debug("rooms %s", body)
    new_dict = {
        key1: {
            x["type_name"]: x["state"] 
            for x in value["devices"] 
            if "state" in x and "type_name" in x
        } 
        for key1, value in body.items() 
        if "devices" in value
    }
    logger.debug("rooms new_dict: %s", new_dict)
    try:
        context.update("room", build_room_context(body))
        # for key, data in new_dict.items():
        #     asyncio.run(roomDataPoll.set_async(key, data))
    except Exception as e:
        logger.debug("error", e)