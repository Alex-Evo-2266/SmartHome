from app.configuration.routes.routes import Routes
from app.pkg import router_config
from app.internal.pages.routes import pages

__routes__ = Routes(routers=(
        router_config,
        pages.router
    ))

