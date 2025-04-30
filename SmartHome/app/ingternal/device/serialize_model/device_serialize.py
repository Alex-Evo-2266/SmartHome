from app.ingternal.device.models.device import Device, DeviceField
from app.ingternal.device.schemas.device import DeviceSerializeSchema, DeviceSerializeFieldSchema
from app.ingternal.device.serialize_model.utils import map_status
from app.ingternal.device_types.serialize_model.read import get_type_device
from app.ingternal.device_types.exceptions.device_type import DeviceTypeNotFound
from typing import List
import logging

# Set up logger for the module
logger = logging.getLogger(__name__)

async def serialize_device(device: Device | None, fields_include: bool = False) -> DeviceSerializeSchema | None:
    """
    Serialize a single device into DeviceSerializeSchema.
    Сериализует одно устройство в DeviceSerializeSchema.

    Args:
        device: The device to serialize.
        fields_include: Whether to include fields in the serialization (default is False).

    Returns:
        DeviceSerializeSchema or None: Serialized device data if device exists, else None.
    """
    if not device:
        logger.warning("Device is None, skipping serialization.")  # Log if device is None
        return None
    
    logger.debug(f"Serializing device: {device.system_name}...")  # Log the device being serialized
    try:
        type_data = await get_type_device(device.system_name)
    except Exception:
        type_data = None


    data = DeviceSerializeSchema(
        name=device.name,
        system_name=device.system_name,
        class_device=device.class_device,
        type=device.type,
        address=device.address,
        token=device.token,
        type_command=device.type_command,
        type_get_data=device.type_get_data,
        status=map_status(device.status),
        type_mask=type_data
    )
    
    if fields_include:
        logger.debug(f"Fields included in the serialization for device: {device.system_name}.")  # Log if fields are included
        data.fields = [await serialize_device_field(x) for x in await device.fields.all()]
    
    logger.debug(f"Device {device.system_name} serialized successfully.")  # Log success
    return data

async def serialize_device_all(fields_include: bool = False):
    """
    Serialize all devices into a list of DeviceSerializeSchema.
    Сериализует все устройства в список DeviceSerializeSchema.

    Args:
        fields_include: Whether to include fields in the serialization (default is False).

    Returns:
        List: List of serialized devices.
    """
    logger.debug("Fetching all devices from the database for serialization...")  # Log the start of fetching devices
    data = await Device.objects.all()
    serialized_devices = [await serialize_device(x, fields_include) for x in data]
    logger.debug(f"Serialized {len(serialized_devices)} devices.")  # Log how many devices were serialized
    return serialized_devices

async def serialize_device_field(field: DeviceField, device_include: bool = False):
    """
    Serialize a single device field into DeviceSerializeFieldSchema.
    Сериализует одно поле устройства в DeviceSerializeFieldSchema.

    Args:
        field: The device field to serialize.
        device_include: Whether to include the device in the field serialization (default is False).

    Returns:
        DeviceSerializeFieldSchema: Serialized device field data.
    """
    logger.debug(f"Serializing field: {field.name}...")  # Log the field being serialized
    data = DeviceSerializeFieldSchema(
        id=field.id,
        name=field.name,
        address=field.address,
        type=field.type,
        low=field.low,
        high=field.high,
        enum_values=field.enum_values,
        read_only=field.read_only,
        icon=field.icon,
        unit=field.unit,
        entity=field.entity,
        virtual_field=field.virtual_field,
        tag=field.tag,
        category=field.category
    )
    
    if device_include:
        logger.debug(f"Including device data in the field serialization for field: {field.name}.")  # Log device inclusion
        await field.device.load()
        data.device = await serialize_device(field.device)
    
    logger.debug(f"Fetching entity list for field: {field.name}...")  # Log entity list fetching
    fields: List[DeviceField] = await DeviceField.objects.all(entity=field.id)
    data.entity_list_id = [x.id for x in fields]
    
    logger.debug(f"Field {field.name} serialized successfully.")  # Log success
    return data
