from SmartHome.logic.groups.GroupFile import Groups
from SmartHome.logic.device.devicesArrey import devicesArrey
from SmartHome.schemas.device import DeviceValueSchema
from SmartHome.schemas.base import FunctionRespons, TypeRespons
from SmartHome.logic.device.deviceSetValue import setValue

import logging

logger = logging.getLogger(__name__)

def is_digit(str):
    try:
        int(str)
        return True
    except:
        return False

async def setValueGroup(data:DeviceValueSchema):
    logger.debug(f'setValueGroup input data:{data.dict()}')
    group = Groups.get(data.systemName)
    if not group:
        return FunctionRespons(status=TypeRespons.INVALID, detail=f"group {data.systemName} not found")
    for item in group.devices:
        device = devicesArrey.get(item.name)
        if not device:
            logger.info(f'device {item.name} not found')
            continue
        field = device["device"].get_field(data.type)
        if not field:
            continue
        if field.type == "number" and not is_digit(data.status):
            continue
        if field.type == "binary" and not is_digit(data.status):
            continue
        await setValue(item.name, data.type, data.status)
    return FunctionRespons(status=TypeRespons.OK, data="ok")
