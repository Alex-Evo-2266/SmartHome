import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.pkg import auth_privilege_dep
from typing import Dict
from typing import Optional, List, Union
from app.ingternal.device.schemas.device import DeviceSchema, StatusForm, DeviceSerializeSchema, DeviceResponseSchema
from app.ingternal.device.schemas.add_device import AddDeviceSchema
from app.ingternal.device.schemas.edit_device import EditDeviceSchema
from app.ingternal.device.schemas.config import DeviceClassConfigResponseSchema

from app.ingternal.device.serialize_model.read import get_serialize_device, get_device
from app.ingternal.device.serialize_model.update import edit_status_device, edit_device
from app.ingternal.device.helpers.get_option_device import get_config_devices
from app.ingternal.device.serialize_model.create import add_device
from app.ingternal.device.serialize_model.delete import delete_device
from app.ingternal.device.set_device_status import set_status

from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.ingternal.device.exceptions.device import DevicesStructureNotFound
from app.ingternal.modules.struct.DeviceStatusStore import store

router = APIRouter(
    prefix="/api-devices/devices",
    tags=["device"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

# Добавление устройства
@router.post("")
async def add_device_url(data: AddDeviceSchema, user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        await add_device(data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Редактирование устройства
@router.put("/{system_name}")
async def edit_dev(system_name: str, data: EditDeviceSchema, user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        await edit_device(system_name, data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Удаление устройства
@router.delete("/{system_name}")
async def delete_dev(system_name: str, user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        await delete_device(system_name)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Получение опций устройства
@router.get("/options", response_model=DeviceClassConfigResponseSchema)
async def get_options_dev(user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        options = get_config_devices()
        return DeviceClassConfigResponseSchema(data=options)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Получение информации об устройстве по его имени
@router.get("/{system_name}", response_model=DeviceSchema)
async def get_dev(system_name: str, user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        return await get_device(system_name)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Получение устройства для сериализации
@router.get("/{system_name}/row", response_model=DeviceSerializeSchema)
async def get_dev_serialize(system_name: str, user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        return await get_serialize_device(system_name)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Получение списка всех устройств
@router.get("", response_model=DeviceResponseSchema)
async def get_all_dev(user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        snapshots = store.get_all_snapshots()
        devices = [DeviceSchema(**x.description.model_dump(), value=x.state) for x in snapshots]
        return DeviceResponseSchema(data=devices)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})
    
# Установка состояния устройства
@router.get("/{system_name}/values/{field_id}/set/{value}")
async def set_device_state(system_name: str, field_id: str, value: Union[str, int], user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        logger.info(f"togle {system_name}, {field_id}, {value}")
        await set_status(system_name, field_id, str(value))
        return JSONResponse(status_code=200, content={"message": "Device state updated"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})
    
# Установка состояния устройства (несколько сразу)
# нужно в будущем реализовать отправку всех полей разом а не по очереди
@router.patch("/{system_name}/values")
async def set_device_state_patch(system_name: str, data: Dict[str, str], user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        logger.info(f"togle {system_name}, {data}")
        for field_id, value in data.items():
            await set_status(system_name, field_id, str(value))
        return JSONResponse(status_code=200, content={"message": "Device state updated"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Обновление статуса устройства (например, подключение/отключение)
@router.patch("/{system_name}/polling")
async def set_connection_status(system_name: str, data: StatusForm, user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        await edit_status_device(system_name, data.status)
        return JSONResponse(status_code=200, content={"message": "Status updated"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})