# from .listener import LoadData

# script_listener = LoadData()

from app.configuration.queue import __queue__
from app.internal.logs import MyLogger

logger = MyLogger().get_logger(__name__)

def run_script(method, properties, body):
    try:
        logger.debug(body)
        if "service" in body and "object" in body and body["service"] == "script":
            __queue__.add("run_script", id=body["object"])
    except Exception as e:
        logger.error(e)