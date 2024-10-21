from .config import Config, ConfigItem, ConfigItemType

def itemConfig(tag: str, key: str, value: str = '', type: ConfigItemType = ConfigItemType.TEXT):
    return ConfigItem(key=key, value=value, tag=tag, type=type)