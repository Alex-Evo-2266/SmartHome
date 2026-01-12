from queue_lib import UniversalQueue
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

__queue__ = UniversalQueue(
    logger=logger
    )