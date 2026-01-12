# from app.ingternal.logs import get_listener_logger
# from app.configuration.queue import __queue__
# import asyncio

# logger = get_listener_logger.get_logger(__name__)

# # async def async_device_listener(data):
# #     print(data["system_name"])
# #     __queue__.add("set_value", **data)

# def device_listener(method, properties, body):
#     logger.info(f"device set value: {body}")
#     __queue__.add("set_value", **(body["data"]))
#     # asyncio.run(async_device_listener(body["data"]))
    