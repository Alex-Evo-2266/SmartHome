import logging

from app.configuration.settings import SERVER_CONFIG
from app.configuration.config import __module_config__
from app.ingternal.server_data.schemas.server_data import ServerConfigSchema

logger = logging.getLogger(__name__)

async def give_server_config():
    try:

        return ServerConfigSchema(
            moduleConfig=__module_config__.all(),
        )
    except Exception as e:
        logger.error(f"error get config. detail:{e}")
        return ServerConfigSchema()
