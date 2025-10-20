# from .listener import LoadData

# script_listener = LoadData()

from app.configuration.queue import __queue__
import logging

logger = logging.getLogger(__name__)

def run_script(method, properties, body):
    try:
        if "service" in body and "object" in body and body["service"] == "script":
            __queue__.add("run_script", id=body["object"])
    except Exception as e:
        logger.error(e)