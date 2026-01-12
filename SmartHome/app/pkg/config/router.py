from config_lib import get_router, ConfigRouterOption
from auth_dep_lib import auth_privilege_dep
from app.pkg.config.core import __config__
from app.bootstrap.const import CONFIG_TAG, ROUTE_PREFIX

router_config = get_router(__config__, ConfigRouterOption(tag=CONFIG_TAG, prefix=ROUTE_PREFIX, depend_function=auth_privilege_dep('device')))
