from SmartHome.logic.device.send_device import send_restart
from settings import configManager
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
# from SmartHome.logic.device.deviceSendControl import updataSendTime
import yaml, logging

from weather.weather import updateWeather

logger = logging.getLogger(__name__)

def conf_init():
    configManager.addConfig("weather", {
        "APPID":"",
        "city":""
    }, updateWeather)

    configManager.addConfig("email", {
        "login":"",
        "password":""
    })

    configManager.addConfig("auth_service", {
        "host":"",
        "client_id":"",
        "client_secret":""
    })

    configManager.addConfig("send_message", {
        "frequency":"3",
    }, send_restart)
