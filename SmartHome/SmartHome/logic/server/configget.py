import yaml, logging

from SmartHome.settings import SERVER_CONFIG
from SmartHome.schemas.server import ServerConfigSchema
# from ..Cart import getPages

logger = logging.getLogger(__name__)

def readConfig():
    try:
        templates = None
        with open(SERVER_CONFIG) as f:
            templates = yaml.safe_load(f)
        return templates
    except FileNotFoundError as e:
        logger.error(f"file not found. file:{SERVER_CONFIG}")
        raise

def getConfig(key):
    try:
        templates = None
        with open(SERVER_CONFIG) as f:
            templates = yaml.safe_load(f)
        return templates[key]
    except FileNotFoundError as e:
        logger.error(f"file not found. file:{SERVER_CONFIG}")
        raise
    except KeyError as e:
        logger.error(f"invalud key. key:{key}")
        raise


async def GiveServerConfig():
    try:
        templates = None
        with open(SERVER_CONFIG) as f:
            templates = yaml.safe_load(f)
        mqttBroker = templates["mqttBroker"]
        zigbeeBroker = templates["zigbee2mqtt"]
        mail = templates["mail"]
        base = templates["base"]
        weather = templates["weather"]
        # retPages = getPages()
        retPages = {"data":[]}
        return ServerConfigSchema(
            mqttBroker=mqttBroker["host"],
            mqttBrokerPort=mqttBroker["port"],
            loginMqttBroker=mqttBroker["user"],
            passwordMqttBroker=mqttBroker["password"],
            zigbee2mqttTopic=zigbeeBroker["topic"],
            emailLogin=mail["login"],
            emailPass=mail["password"],
            pages=retPages["data"],
            city=weather["city"],
            weatherKey=weather["APPID"],
            frequency=base["frequency"]
        )
    except Exception as e:
        logger.error(f"error get config. detail:{e}")
        return ServerConfigSchema()
