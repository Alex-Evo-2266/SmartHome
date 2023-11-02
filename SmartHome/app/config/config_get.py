import yaml, logging

from app.settings import SERVER_CONFIG, configManager
from app.server.schemas import ServerConfigSchema

logger = logging.getLogger(__name__)

async def give_server_config():
    try:

        return ServerConfigSchema(
            moduleConfig=configManager.allConfig(),
        )
    except Exception as e:
        logger.error(f"error get config. detail:{e}")
        return ServerConfigSchema()
