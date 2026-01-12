
from app.pkg.logger import MyLogger
from app.core.state.get_store import get_container
from app.core.entities.device.set_status import set_status_for_device
from app.exceptions.device import DeviceNotFound

logger = MyLogger().get_logger(__name__)

async def set_status(system_name: str, field_id: str, value: str) -> None:
    """Асинхронная установка значения без учета типа поля (прямой вызов)."""
    logger.info(f"Attempting to set status for device '{system_name}', field '{field_id}' with value '{value}'")

    device_cond = get_container().connect_store.get(system_name)
    if not device_cond:
        logger.error(f"Device '{system_name}' not found.")
        raise DeviceNotFound(f"Device '{system_name}' not found.")

    try:
        await device_cond.device.set_value(field_id, value)
        logger.info(f"Successfully set status for device '{system_name}', field '{field_id}' to '{value}'")
    except Exception as e:
        logger.error(f"Error setting value for device '{system_name}', field '{field_id}': {e}")
        raise


async def set_status_correct(system_name: str, field_id: str, value: str) -> None:
    """Асинхронная установка значения с учетом типа поля и ограничений."""
    logger.info(f"Attempting to set corrected status for device '{system_name}', field '{field_id}' with value '{value}'")

    device_cond = get_container().connect_store.get(system_name)
    if not device_cond:
        logger.error(f"Device '{system_name}' not found.")
        raise DeviceNotFound(f"Device '{system_name}' not found.")

    try:
        await set_status_for_device(device_cond.device, field_id, value)
    except Exception as e:
        logger.error(f"Error setting corrected value for device '{system_name}', field '{field_id}': {e}")
        raise
