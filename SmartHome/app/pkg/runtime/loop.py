from loop_lib import EventLoop
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

loop = EventLoop(logger=logger)