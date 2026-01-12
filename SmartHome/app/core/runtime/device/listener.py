from app.pkg.logger import get_listener_logger
from app.pkg.runtime.queue import __queue__

logger = get_listener_logger.get_logger(__name__)

def device_listener(method, properties, body):
    logger.info(f"device set value: {body}")
    __queue__.add("set_value", **(body["data"]))
    