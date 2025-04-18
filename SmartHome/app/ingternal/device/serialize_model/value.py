from app.ingternal.device.models.device import Value, DeviceField
from app.ingternal.device.schemas.device import ValueSerializeResponseSchema, ValueSerializeResponseListSchema, ValueSerializeStorysSchema
from app.ingternal.device.serialize_model.value_serialize import value_serialize
from datetime import datetime, timedelta
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

async def serialize_history(field: DeviceField, target_time: datetime = datetime.now() - timedelta(days=7)):
    # Убедитесь, что target_time - это datetime объект
    if not isinstance(target_time, datetime):
        raise ValueError("target_time должен быть datetime объектом")
    
    # Форматируем дату в строку (если поле в БД хранится как строка)
    date_format = "%Y-%m-%d %H:%M:%S"
    start_date_str = target_time.strftime(date_format)
    
    try:
        # Выполняем запрос
        # values = await Value.objects.filter(
        #     datatime__gte=start_date_str,  # Используем datatime вместо your_time_field
        #     field=field.id
        # ).order_by("-datatime").limit(100).all()

        query = """
        SELECT * FROM `values` 
        WHERE datatime >= STR_TO_DATE(:start_date, '%Y-%m-%d %H:%i:%s') 
        AND field = :field_id
        ORDER BY datatime DESC
        """
        print("p0")
        values = await Value.objects.database.fetch_all(
            query, 
            {"start_date": start_date_str, "field_id": field.id}
        )
        print("p1", len(values))
        return ValueSerializeResponseSchema(
            data=[value_serialize(item) for item in values],
            field_id=field.id,
            name=field.name,
            type=field.type,
            low=field.low,
            high=field.high
        )
    except Exception as e:
        # Логируем ошибку для отладки
        logger.error(f"Ошибка при получении истории: {str(e)}")
        raise HTTPException(status_code=500, detail="Ошибка при получении исторических данных")


async def get_field_history(field_id: str, target_time: datetime = datetime.now() - timedelta(days=7)):
    # Получить 20 записей Value с указанным field_id
    field:DeviceField = await DeviceField.objects.get_or_none(id=field_id)
    if(not field):
        raise Exception("field not found")
    return await serialize_history(field, target_time)

# async def get_device_history(system_name: str, target_time: datetime = datetime.now() - timedelta(days=7)):
#     fields:list[DeviceField] = await DeviceField.objects.filter(device=system_name).all()
#     data = [await serialize_history(field, target_time) for field in fields]
#     return ValueSerializeResponseListSchema(data=data, system_name=system_name)

async def get_device_history(system_name: str, time: datetime = datetime.now() - timedelta(days=7)):
    values:Value = await Value.objects.select_related("field").filter(
        datatime__gte=time,
        field__device=system_name
    ).limit(200).all()
    # Группируем значения по полю (field)
    grouped = {}
    for value in values:
        field_id = str(value.field.id)
        if field_id not in grouped:
            grouped[field_id] = {
                "field": value.field,
                "values": []
            }
        grouped[field_id]["values"].append(value)

    
    # Формируем ответ согласно схемам
    response_data = []
    for field_id, group in grouped.items():
        field = group["field"]
        value_schemas = [
            ValueSerializeStorysSchema(
                id=str(value.id),
                datatime=value.datatime,
                value=str(value.value)
            )
            for value in group["values"]
        ]
        
        response_schema = ValueSerializeResponseSchema(
            data=value_schemas,
            field_id=field_id,
            type=field.type,
            high=str(field.high) if field.high is not None else None,
            low=str(field.low) if field.low is not None else None,
            name=field.name
        )
        response_data.append(response_schema)
    
    return ValueSerializeResponseListSchema(
        data=response_data,
        system_name=system_name
    )

