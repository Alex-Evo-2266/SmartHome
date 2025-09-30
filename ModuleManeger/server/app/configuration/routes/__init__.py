from app.configuration.routes.routes import Routes
from app.internal.module.routes import modules

__routes__ = Routes(routers=(
    modules.router,
    ))

