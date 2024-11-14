from app.configuration.routes.routes import Routes

from app.pkg import router_config
from app.ingternal.device.routes import device

__routes__ = Routes(routers=(
    router_config,
    device.router
    ))

