"""
ASGI config for SmartHome project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
SmartHome
"""

import os
from .wsgi import *
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter,URLRouter
from django.core.asgi import get_asgi_application
import smartHomeApi.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SmartHome.settings')

application = ProtocolTypeRouter({
    # "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            smartHomeApi.routing.websocket_urlpatterns
        )
    ),
})
