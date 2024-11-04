from app.configuration.routes.routes import Routes
from app.pkg import router_config
from app.internal.pages.routes import pages
from app.moduls import routers

__routes__ = Routes(routers=(
        router_config,
        pages.router,
        routers()
    ))

