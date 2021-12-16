from ..classes.devicesArrey import DevicesArrey
import logging

logger = logging.getLogger(__name__)

devicesArrey = DevicesArrey()

def setValue(id, type, value):
    logger.debug(f'setValue input data:(id:{id},type:{type},value:{value})')
    try:
        deviceDect = devicesArrey.get(id)
        device = deviceDect["device"]
        e = device
        e.set_value(type,value)
        return True
    except Exception as ex:
        logger.erroe(f'error set value. id:{id}, detail:{ex}')
        return None
