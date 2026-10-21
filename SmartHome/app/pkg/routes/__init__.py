from app.pkg.routes.routes import Routes

from app.pkg.config.router import router_config
from app.api.automation import automation, automation_v4
from app.api.device import device_type, device, history
from app.api.room import room

__routes__ = Routes(routers=(
    router_config,
    device.router,
    automation.router,
    automation_v4.router,
    device_type.router,
    history.router,
    room.router
    ))
