from app.configuration.routes.routes import Routes

from app.pkg import router_config
from app.ingternal.device.routes import device, history
from app.ingternal.automation.routes import automation
from app.ingternal.device_types.routes import device_type
from app.ingternal.room.routes import room

__routes__ = Routes(routers=(
    router_config,
    device.router,
    automation.router,
    device_type.router,
    history.router,
    room.router
    ))

