from queue_lib import UniversalQueue
from app.internal.listener.handlers.script_run_handler import RunItem, handle_run
import logging

logger = logging.getLogger(__name__)

__queue__ = UniversalQueue(
    logger=logger, 
    registrations={
        "run_script": (RunItem, handle_run),
    })