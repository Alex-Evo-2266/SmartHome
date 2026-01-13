# from .listener import LoadDataFanout
# from app.internal.device.array.serviceDataPoll import deviceDataPoll

# devices_listener = LoadDataFanout()
from app.internal.run_script.context_store import context
from app.internal.run_script.context_build import build_device_context

    # devices_listener.connect(EXCHANGE_DEVICE_DATA, setDevice)
from app.internal.logs import MyLogger

logger = MyLogger().get_logger(__name__)

def device_listener(method, properties, body):
    try:
        logger.info(f"device set value: {body}")
        # deviceDataPoll._data = body
        context.update("device", build_device_context(body))
    except Exception as e:
        logger.error(e)