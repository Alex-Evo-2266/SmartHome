from app.ingternal.device.models.device import Value, DeviceField
from app.ingternal.device.schemas.device import (
    ValueSerializeResponseSchema,
    ValueSerializeResponseListSchema,
    ValueSerializeStorysSchema,
)
from app.ingternal.device.serialize_model.value_serialize import value_serialize
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


async def get_field_history(
    field_id: str, time: datetime = datetime.now() - timedelta(days=7)
) -> ValueSerializeResponseSchema:
    """
    Retrieve history of values for a specific field within a given time range.
    
    Args:
        field_id: ID of the field to get history for
        time: Start time for the history query (default: 7 days ago)
        
    Returns:
        ValueSerializeResponseSchema containing field metadata and historical values
    """
    try:
        logger.info(f"Fetching history for field {field_id} from {time}")
        
        # Get the field object
        field = await DeviceField.objects.get(id=field_id)
        
        # Query historical values for the field
        history = await Value.objects.filter(
            field=field,  # Use relationship
            datatime__gte=time
        ).order_by("-datatime").all()  # Sort from newest to oldest
        
        logger.debug(f"Found {len(history)} historical records for field {field_id}")
        
        # Create response schema
        res = ValueSerializeResponseSchema(
            field_id=field_id,
            type=field.type,
            low=field.low,
            high=field.high,
            name=field.name,
            data=[value_serialize(item) for item in history]
        )
        
        return res
        
    except Exception as e:
        logger.error(f"Error fetching field history for {field_id}: {str(e)}")
        raise


async def get_device_history(
    system_name: str, time: datetime = datetime.now() - timedelta(days=7)
) -> ValueSerializeResponseListSchema:
    """
    Retrieve history of values for all fields of a specific device within a given time range.
    
    Args:
        system_name: System name of the device to get history for
        time: Start time for the history query (default: 7 days ago)
        
    Returns:
        ValueSerializeResponseListSchema containing device name and field histories
    """
    try:
        logger.info(f"Fetching device history for {system_name} from {time}")
        
        # Query all values for the device with related field information
        values: Value = await Value.objects.select_related("field").filter(
            datatime__gte=time,
            field__device=system_name
        ).all()
        
        logger.debug(f"Found {len(values)} total records for device {system_name}")
        
        # Group values by field
        grouped = {}
        for value in values:
            field_id = str(value.field.id)
            if field_id not in grouped:
                grouped[field_id] = {
                    "field": value.field,
                    "values": []
                }
            grouped[field_id]["values"].append(value)
        
        # Format response data
        response_data = []
        for field_id, group in grouped.items():
            field = group["field"]
            
            # Create value schemas for each historical record
            value_schemas = [
                ValueSerializeStorysSchema(
                    id=str(value.id),
                    datatime=value.datatime,
                    value=str(value.value),
                    status=value.status_device
                )
                for value in group["values"]
            ]
            
            # Create field response schema
            response_schema = ValueSerializeResponseSchema(
                data=value_schemas,
                field_id=field_id,
                type=field.type,
                high=str(field.high) if field.high is not None else None,
                low=str(field.low) if field.low is not None else None,
                name=field.name
            )
            response_data.append(response_schema)
        
        logger.info(f"Returning history for {len(response_data)} fields of device {system_name}")
        
        return ValueSerializeResponseListSchema(
            data=response_data,
            system_name=system_name
        )
        
    except Exception as e:
        logger.error(f"Error fetching device history for {system_name}: {str(e)}")
        raise