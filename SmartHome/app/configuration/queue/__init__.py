from queue_lib import UniversalQueue
from app.ingternal.logs import get_queue

logger = get_queue.get_logger(__name__)

__queue__ = UniversalQueue(
    logger=logger
    )