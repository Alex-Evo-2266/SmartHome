import logging
from typing import Optional

from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.loop.loop import loop
from app.pkg.websoket.websocket import WebSocketMenager
from app.pkg import __config__
from app.configuration.settings import TYPE_SEND_DEVICE, SEND_DEVICE_CONF, LOOP_SEND_DEVICE, TYPE_SEND_PATCH_DEVICE
from app.ingternal.logs import get_base_logger
from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.modules.struct.DeviceStatusStore import store


logger = get_base_logger.get_logger(__name__)

# Отправка данных о устройствах
async def send_device_data():
    # logger.info("Attempting to send device data...")
    
    # if not devices:
    #     logger.warning("No devices structure found.")
    #     return
    
    # schemas = devices.get_all_data()

    snapshots = store.get_all_snapshots()
    devices = [DeviceSchema(**x.description.model_dump(), value=x.state) for x in snapshots]

    try:
        await WebSocketMenager.send_information(TYPE_SEND_DEVICE, [device.model_dump() for device in devices])
        logger.info("Device data successfully sent.")
    except Exception as e:
        logger.error(f"Error sending device data: {str(e)}")

async def send_device_patch_data(patchs):
    try:
        await WebSocketMenager.send_information(TYPE_SEND_PATCH_DEVICE, patchs.model_dump())
        logger.info("Device data successfully sent.")
    except Exception as e:
        logger.error(f"Error sending device data: {str(e)}")

# Перезапуск отправки данных о устройствах
async def restart_send_device_data():
    logger.info('Attempting to restart sending device data...')
    item = __config__.get(SEND_DEVICE_CONF)

    store.subscribe_patch_global(LOOP_SEND_DEVICE, send_device_patch_data)
    
    if item and item.value:
        logger.info(f"Registering device data sending with interval {item.value}")
        loop.register(LOOP_SEND_DEVICE, send_device_data, int(item.value))
    else:
        logger.warning(f"Configuration not found or invalid, using default interval of 6 seconds.")
        loop.register(LOOP_SEND_DEVICE, send_device_data, 120)
