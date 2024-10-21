from app.configuration.routes.routes import Routes

from app.internal.config.routes import config

__routes__ = Routes(routers=(
        config.router,
    ))

