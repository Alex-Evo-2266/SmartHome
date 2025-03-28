from app.ingternal.device_types.schemas.add_device_type import AddOrEditDeviceTypeSchema
from app.ingternal.device_types.serialize_model.delete import delete_type_device_by_device
from app.ingternal.device_types.serialize_model.create import create
from app.ingternal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

async def update_type_device(data: AddOrEditDeviceTypeSchema) -> None:
    """
    Updates a device type by first deleting the existing one and then creating a new version.
    
    Args:
        data: AddOrEditDeviceTypeSchema containing the device type data
        
    Raises:
        Exception: If any error occurs during the update process
    """
    try:
        logger.info(f"Starting device type update for device: {data.device}")
        logger.debug(f"Update data: name_type={data.name_type}, fields_count={len(data.fields)}")
        
        # Step 1: Delete existing device type
        logger.debug(f"Deleting existing device type for device: {data.device}")
        await delete_type_device_by_device(data.device)
        logger.info(f"Successfully deleted old device type for device: {data.device}")
        
        # Step 2: Create new device type
        logger.debug(f"Creating new device type for device: {data.device}")
        await create(data)
        logger.info(f"Successfully created new device type for device: {data.device}")
        
        logger.info(f"Completed device type update for device: {data.device}")
        
    except Exception as e:
        logger.error(
            f"Failed to update device type for device {data.device}: {str(e)}",
            exc_info=True
        )
        raise