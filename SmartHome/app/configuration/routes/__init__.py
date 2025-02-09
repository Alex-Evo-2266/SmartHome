from app.configuration.routes.routes import Routes

from app.pkg import router_config
from app.ingternal.device.routes import device
from app.ingternal.automation.routes import automation

__routes__ = Routes(routers=(
    router_config,
    device.router,
    automation.router
    ))

