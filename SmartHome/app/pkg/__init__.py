from app.configuration.settings import CONFIG_TAG, ROUTE_PREFIX, CONFIG_DIR, CONFIG_FILE_NAME
from config_lib import get_router, ConfigRouterOption, Config, itemConfig, ConfigItemType
from auth_dep_lib import auth_privilege_dep
from app.pkg.loop import EventLoop, EventLoopItem
from rabitmq import *

__config__ = Config(CONFIG_DIR, CONFIG_FILE_NAME)

router_config = get_router(__config__, ConfigRouterOption(tag=CONFIG_TAG, prefix=ROUTE_PREFIX, depend_function=auth_privilege_dep('device')))

loop = EventLoop()