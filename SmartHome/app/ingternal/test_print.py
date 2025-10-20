
from app.ingternal.logs import get_test_logger

logger = get_test_logger.get_logger(__name__)

async def print_test(*args, **keys):
    logger.info(f"{args} {keys}")