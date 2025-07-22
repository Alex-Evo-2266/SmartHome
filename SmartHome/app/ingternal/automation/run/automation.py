import logging
from app.ingternal.automation.schemas.automation import AutomationSchema, ConditionItemSchema, ActionItemSchema
from app.ingternal.automation.schemas.enums import ConditionType, Operation
from app.ingternal.device.schemas.enums import TypeDeviceField
from typing import Optional

from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.device.exceptions.device import DeviceNotFound, DeviceNotValueFound, DeviceFieldNotFound
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.senderPoll.sender import sender_script

from app.configuration.settings import DEVICE_DATA_POLL

from app.ingternal.logs import get_automatization

logger = get_automatization.get_logger(__name__)

async def condition_data(service: str, object: str, data: str):
    if service == 'device':
        dev: ObservableDict = servicesDataPoll.get(DEVICE_DATA_POLL)
        device: Optional[DeviceSchema] = dev.get(object)
        if not device:
            logger.error(f"Device not found: {object}")
            raise DeviceNotFound()
        value = device.value.get(data, None)
        logger.info(f"Fetched device value: {value} for device {object}")
        if value is None:
            logger.error(f"Device value not found: {data} in {object}")
            raise DeviceNotValueFound()
        return value
    elif service == 'value':
        return data
    elif service == 'time':
        pass
    else:
        logger.warning(f"Unknown service type: {service}")
        return None

async def condition(condition: ConditionItemSchema) -> bool:
    condition_item1 = await condition_data(condition.arg1_service, condition.arg1_object, condition.arg1_data)
    condition_item2 = await condition_data(condition.arg2_service, condition.arg2_object, condition.arg2_data)
    
    if condition.operation == Operation.EQUAL:
        return condition_item1 == condition_item2
    elif condition.operation == Operation.NOT_EQUAL:
        return condition_item1 != condition_item2

    try:
        condition_item1 = int(condition_item1)
        condition_item2 = int(condition_item2)
    except ValueError:
        logger.error("Failed to convert condition values to int")
        return False
    
    logger.info(f"Evaluating condition: {condition.operation} with values {condition_item1} and {condition_item2}")
    
    
    if condition.operation == Operation.MORE:
        return condition_item1 > condition_item2
    elif condition.operation == Operation.MORE_OR_EQUAL:
        return condition_item1 >= condition_item2
    elif condition.operation == Operation.LESS:
        return condition_item1 < condition_item2
    elif condition.operation == Operation.LESS_OR_EQUAL:
        return condition_item1 <= condition_item2
    return False

async def action(data: ActionItemSchema):
    if data.service == "device":
        device = DevicesArray.get(data.object)
        if not device:
            logger.error(f"Device not found: {data.object}")
            raise DeviceNotFound()
        device_control: IDevice = device.device
        field = device_control.get_field_by_name(data.field)
        if not field:
            logger.error(f"Device field not found: {data.field} in {data.object}")
            raise DeviceFieldNotFound()
        
        if field.get_type() == TypeDeviceField.BINARY and data.data == "target":
            value = field.get()
            logger.info(f"Processing binary field: {field}, current value: {value}")
            if value is None and field.get_high() is None:
                device_control.set_value(field.get_id(), "1", script=True)
            elif value is None:
                device_control.set_value(field.get_id(), field.get_high(), script=True)
            elif (field.get_high() is None and value == "0"):
                device_control.set_value(field.get_id(), "1", script=True)
            elif field.get_high() is not None and value == "0":
                device_control.set_value(field.get_id(), field.get_high(), script=True)
            elif (field.get_low() is None and value == "1"):
                device_control.set_value(field.get_id(), "0", script=True)
            elif (field.get_low() is not None and value == "1"):
                device_control.set_value(field.get_id(), field.get_low(), script=True)
        else:
            logger.info(f"Setting field {data.field} to {data.data}")
            device_control.set_value(field.get_id(), data.data, script=True)
    elif data.service == "script":
        await sender_script.send(data.model_dump())
        logger.info(f"Executing script action: {data.object}")
        pass

async def automation(data: AutomationSchema):
    logger.debug(f"Activate: {data}")
    logger.info(f"Activate: {data.name}, status: {data.is_enabled}")
    if not data.is_enabled:
        logger.info(f"{data.name}, status: {data.is_enabled} skiped")
        return
    conditions = [await condition(condition_schema) for condition_schema in data.condition]
    if len(conditions) == 0 or (data.condition_type == ConditionType.AND and all(conditions)) or (data.condition_type == ConditionType.OR and any(conditions)):
        logger.info("Executing THEN branch actions")
        for action_item in data.then:
            await action(action_item)
    else:
        logger.info("Executing ELSE branch actions")
        for action_item in data.else_branch:
            await action(action_item)
