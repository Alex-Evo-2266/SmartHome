from settings import configManager
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from SmartHome.logic.device.deviceSendControl import updataSendTime
import yaml, logging

from ..weather import updateWeather

logger = logging.getLogger(__name__)

def confinit():
    configManager.addConfig("weather", {
        "APPID":"",
        "city":""
    }, updateWeather)

    configManager.addConfig("email", {
        "login":"",
        "password":""
    })

    configManager.addConfig("base", {
        "frequency":"3",
        "host":"",
        "client_id":"",
        "client_secret":""
    }, updataSendTime)
