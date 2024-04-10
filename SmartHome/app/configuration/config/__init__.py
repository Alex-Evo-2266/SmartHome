from app.configuration.config.config import ModuleConfig
from app.configuration.settings import SERVER_CONFIG

from app.ingternal.device.device_data.send_device import send_restart

__module_config__ = ModuleConfig(SERVER_CONFIG)

__module_config__.register_config("email", {
	"login":"",
	"password":""
})

__module_config__.register_config("auth_service", {
	"host":"",
	"client_id":"",
	"client_secret":""
})

async def send_restart_callback():
    await send_restart(__module_config__)

__module_config__.register_config("send_message", {
	"frequency":"3",
}, send_restart_callback)