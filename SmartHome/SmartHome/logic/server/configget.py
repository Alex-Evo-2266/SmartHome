import yaml, logging

from SmartHome.settings import SERVER_CONFIG
from SmartHome.schemas.server import ServerConfigSchema
from .modulesconfig import configManager
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
