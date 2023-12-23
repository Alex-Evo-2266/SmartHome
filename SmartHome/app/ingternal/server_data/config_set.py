from typing import Any, Dict
import logging

from app.configuration.settings import SERVER_CONFIG
from app.configuration.config import __module_config__

logger = logging.getLogger(__name__)

async def server_config_edit(data: Dict[str, Any] | None):
    if not data:
        raise Exception("no data")
    try:
        for key in data:
            await __module_config__.set_config(key, data[key])
    except FileNotFoundError as e:
        logger.error(f"file not fount. file:{SERVER_CONFIG}, detail:{e}. ")
        raise
    except Exception as e:
        logger.error(f"error. file:{SERVER_CONFIG}, detail:{e}. ")
        raise
