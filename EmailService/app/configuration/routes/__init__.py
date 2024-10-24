from app.configuration.routes.routes import Routes
from app.pkg import router_config
from app.internal.email.routes import email

__routes__ = Routes(routers=(
        router_config,
        email.router
    ))

