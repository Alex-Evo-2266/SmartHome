from app.configuration.routes.routes import Routes
from app.pkg import router_config
from app.internal.pages.routes import pages
from app.internal.dashboard.routes import dashboard, user_dashboard
from app.moduls import routers

__routes__ = Routes(routers=(
        router_config,
        pages.router,
        dashboard.router,
        user_dashboard.router,
        routers()
    ))

