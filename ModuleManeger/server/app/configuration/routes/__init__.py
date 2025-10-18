from app.configuration.routes.routes import Routes
from app.internal.module.routes import modules, modules_core

__routes__ = Routes(routers=(
    modules.router,
    modules_core.router
    ))

