# from .listener import LoadDataFanout
from app.internal.device.array.serviceDataPoll import deviceDataPoll
import logging

# devices_listener = LoadDataFanout()

    # devices_listener.connect(EXCHANGE_DEVICE_DATA, setDevice)
logger = logging.getLogger(__name__)

def device_listener(method, properties, body):
    try:
        logger.info(f"device set value: {body}")
        deviceDataPoll._data = body
    except Exception as e:
        logger.error(e)