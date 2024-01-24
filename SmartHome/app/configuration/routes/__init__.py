from app.configuration.routes.routes import Routes
from app.ingternal.authtorization.routes import authtorization, style, user
from app.ingternal.device.routes import device
from app.ingternal.menu.routes import menu
from app.ingternal.server_data.routes import server_data
from app.ingternal.modules.routes import modules
from app.ingternal.automation.routes import automations

__routes__ = Routes(routers=(
    authtorization.router, 
    style.router, 
    user.router,
    device.router,
    menu.router,
    server_data.router,
    modules.router_moduls,
    automations.router
    ))

