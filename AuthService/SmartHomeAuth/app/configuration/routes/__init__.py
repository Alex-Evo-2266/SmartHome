from app.configuration.routes.routes import Routes

from app.internal.auth.routes import login, session
from app.internal.role.routes import role, privilege
from app.internal.user.routes import user

__routes__ = Routes(routers=(
        login.router,
        user.router,
        session.router,
        role.router,
        privilege.router
    ))

