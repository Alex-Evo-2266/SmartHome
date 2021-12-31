from .modulesconfig import configManager
from SmartHome import settings
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
import yaml, logging

from ..weather import updateWeather

logger = logging.getLogger(__name__)

def confinit():
    configManager.addConfig(
        ServerModuleConfigSchema(
            name="weather",
            fields=[
                ServerModuleConfigFieldSchema(
                    name="APPID",
                    value=''
                ),
                ServerModuleConfigFieldSchema(
                    name="city",
                    value=''
                )
            ]
        ),
        updateWeather
    )

    configManager.addConfig(
        ServerModuleConfigSchema(
            name="email",
            fields=[
                ServerModuleConfigFieldSchema(
                    name="login",
                    value=''
                ),
                ServerModuleConfigFieldSchema(
                    name="password",
                    value=''
                )
            ]
        )
    )

    configManager.addConfig(
        ServerModuleConfigSchema(
            name="base",
            fields=[
                ServerModuleConfigFieldSchema(
                    name="frequency",
                    value='3'
                )
            ]
        )
    )
