from app.ingternal.device.models.device import Device, DeviceField
from app.ingternal.device.schemas.device import DeviceSerializeSchema, DeviceSerializeFieldSchema
from app.ingternal.device.serialize_model.utils import map_status
from typing import List

async def serialize_device(device: Device | None, fields_include: bool = False)->DeviceSerializeSchema | None:
    if(not device):
        return None
    data = DeviceSerializeSchema(
        name=device.name,
        system_name=device.system_name,
        class_device=device.class_device,
        type=device.type,
        address=device.address,
        token=device.token,
        type_command=device.type_command,
        type_get_data=device.type_get_data,
        status=map_status(device.status)
    )
    if fields_include:
        data.fields = [await serialize_device_field(x) for x in await device.fields.all()]
    return data

async def serialize_device_all(fields_include: bool = False):
    data = await Device.objects.all()
    return [await serialize_device(x, fields_include) for x in data]

async def serialize_device_field(field: DeviceField, device_include: bool = False):
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
        virtual_field=field.virtual_field
    )
    if device_include:
        await field.device.load()
        data.device = serialize_device(field.device)
    fields:List[DeviceField] = await DeviceField.objects.all(entity=field.id)
    data.entity_list_id = [x.id for x in fields]
    return data