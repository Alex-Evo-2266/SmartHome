from ..devices_arrey import DevicesArrey
import logging

logger = logging.getLogger(__name__)

async def setValue(systemName, type, value):
    logger.debug(f'setValue input data:(systemName:{systemName},type:{type},value:{value})')
    try:
        deviceDect = DevicesArrey.get(systemName)
        device = deviceDect["device"]
        field = device.get_field(type)
        if not field:
            logger.debug(f'field not found. systemName:{systemName},type:{type},value:{value}')
            return None
        device.set_value(type,value)
        return True
    except Exception as ex:
        logger.error(f'error set value. systemName:{systemName}, detail:{ex}')
        return None
