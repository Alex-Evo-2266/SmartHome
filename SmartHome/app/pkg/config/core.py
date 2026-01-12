from app.bootstrap.const import CONFIG_DIR, CONFIG_FILE_NAME

from config_lib import Config, ConfigItemType, ConfigItem, itemConfig

__config__ = Config(CONFIG_DIR, CONFIG_FILE_NAME)