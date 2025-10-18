from app.configuration.routes.routes import Routes
from app.internal.module.routes import modules
from app.internal.module_core.routes import modules_core

__routes__ = Routes(routers=(
    modules.router,
    modules_core.router
    ))

