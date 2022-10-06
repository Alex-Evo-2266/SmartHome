from typing import Any, Dict
import yaml, logging

from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigSchema
from settings import SERVER_CONFIG, configManager
# from ..deviceControl.mqttDevice.connect import reconnect,publish
# from ..deviceControl.mqttDevice.mqttScan import ClearTopicks
# from ..weather import updateWeather

logger = logging.getLogger(__name__)

async def ServerConfigEdit(data: Dict[str, Any]):
    try:
        for key in data:
            await configManager.set(key, data[key])
        return {"status":"ok"}
    except FileNotFoundError as e:
        logger.error(f"file not fount. file:{SERVER_CONFIG}, detail:{e}. ")
        return {"status":"error"}
    except Exception as e:
        logger.error(f"error. file:{SERVER_CONFIG}, detail:{e}. ")
        return {"status":"error"}
