
from app.configuration.config import __module_config__
import logging

logger = logging.getLogger(__name__)

def init_conf():
    __module_config__.register_config("email", {
        "login":"",
        "password":""
    })

    __module_config__.register_config("auth_service", {
        "host":"",
        "client_id":"",
        "client_secret":""
    })

    __module_config__.register_config("send_message", {
        "frequency":"3",
    })
