import yaml, logging

from settings import SERVER_CONFIG, configManager
from SmartHome.schemas.server import ServerConfigSchema
from SmartHome.logic.homePage import getPagesName

logger = logging.getLogger(__name__)

async def GiveServerConfig():
    try:
        retPages = getPagesName()

        return ServerConfigSchema(
            moduleConfig=configManager.allConfig(),
            pages=retPages.data,
        )
    except Exception as e:
        logger.error(f"error get config. detail:{e}")
        return ServerConfigSchema()
