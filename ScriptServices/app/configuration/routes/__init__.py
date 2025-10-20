from app.configuration.routes.routes import Routes
from app.internal.script.routes import script

__routes__ = Routes(routers=(
    script.router,
    ))

