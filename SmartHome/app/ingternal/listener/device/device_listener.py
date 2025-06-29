from app.ingternal.logs import get_listener_logger

logger = get_listener_logger.get_logger(__name__)

def device_listener(method, properties, body):
    logger.info(f"device set value: {body}")