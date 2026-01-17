from app.pkg.config.core import __config__, itemConfig, ConfigItemType
from app.bootstrap.const import POLLING_INTERVAL, SEND_DEVICE_CONF
from app.pkg.logger import MyLogger
from app.core.runtime.device.polling_device import restart_polling
from app.core.runtime.device.send import restart_send_device_data

logger = MyLogger().get_logger(__name__)

def register_config():
    # Регистрация конфигурационных параметров
    try:
        __config__.register_config(
            itemConfig(tag="device service", key=POLLING_INTERVAL, type=ConfigItemType.NUMBER),
            restart_polling
        )
        __config__.register_config(
            itemConfig(tag="device service", key=SEND_DEVICE_CONF, type=ConfigItemType.NUMBER, value="120"),
            restart_send_device_data
        )
        logger.info("Configuration items registered.")
    except Exception as e:
        logger.error(f"Error registering configuration items: {e}")