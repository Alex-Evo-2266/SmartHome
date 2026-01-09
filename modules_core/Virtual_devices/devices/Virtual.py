import logging
from app.ingternal.device.classes.baseDevice import BaseDevice
from app.ingternal.device.schemas.config import ConfigSchema, ChangeField
from app.ingternal.device.cache.cach_field import get_cached_last_value


# Настройка логирования
logger = logging.getLogger(__name__)

class Virtual(BaseDevice):

    device_config = ConfigSchema(
        class_img="Virtual_devices/imgVirtualDevice.png",
        address=False,
        type_get_data=False,
        fields_change=ChangeField(value=True),
        fields_creation_data=ChangeField(address=False),
        virtual=True
    )

    async def set_value(self, field_id: str, value: str, *, script:bool = False, save_status: bool = True):

        await super().set_value(field_id, value, script=script, save_status=save_status)

    async def async_init(self):
        for field in self.fields:
            (value, status) = await get_cached_last_value(field.data.id)
            f = self.get_field(field.data.id)
            f.set(value, False)
        return await super().async_init()