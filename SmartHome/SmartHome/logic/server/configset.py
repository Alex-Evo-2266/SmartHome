import yaml, logging

from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigSchema
from SmartHome.settings import SERVER_CONFIG
from .modulesconfig import configManager
# from ..deviceControl.mqttDevice.connect import reconnect,publish
# from ..deviceControl.mqttDevice.mqttScan import ClearTopicks
# from ..weather import updateWeather

logger = logging.getLogger(__name__)

async def ServerConfigEdit(data: ServerConfigSchema):
    try:
        for item in data.moduleConfig:
            await configManager.set(item)
        return {"status":"ok"}
    except FileNotFoundError as e:
        logger.error(f"file not fount. file:{SERVER_CONFIG}, detail:{e}. ")
        return {"status":"error"}
    except Exception as e:
        logger.error(f"error. file:{SERVER_CONFIG}, detail:{e}. ")
        return {"status":"error"}
