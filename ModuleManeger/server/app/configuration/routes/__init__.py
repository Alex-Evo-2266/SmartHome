from app.configuration.routes.routes import Routes
from app.internal.module.routes import modules, modules_core, core
from app.pkg import router_config

__routes__ = Routes(routers=(
    router_config,
    modules.router,
    modules_core.router,
    core.router
    ))

