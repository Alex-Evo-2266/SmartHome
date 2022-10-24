import yaml, logging

from settings import SERVER_CONFIG, configManager
from SmartHome.schemas.server import ServerConfigSchema

logger = logging.getLogger(__name__)

async def GiveServerConfig():
    try:

        return ServerConfigSchema(
            moduleConfig=configManager.allConfig(),
        )
    except Exception as e:
        logger.error(f"error get config. detail:{e}")
        return ServerConfigSchema()
