from typing import Any, Dict
import yaml, logging

# from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigSchema
from app.settings import SERVER_CONFIG, configManager
# from ..deviceControl.mqttDevice.connect import reconnect,publish
# from ..deviceControl.mqttDevice.mqttScan import ClearTopicks
# from ..weather import updateWeather

logger = logging.getLogger(__name__)

async def server_config_edit(data: Dict[str, Any] | None):
    if not data:
        raise Exception("no data")
    try:
        for key in data:
            await configManager.set(key, data[key])
    except FileNotFoundError as e:
        logger.error(f"file not fount. file:{SERVER_CONFIG}, detail:{e}. ")
        raise
    except Exception as e:
        logger.error(f"error. file:{SERVER_CONFIG}, detail:{e}. ")
        raise
