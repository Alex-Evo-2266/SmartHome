# import logging
# from typing import Union

# from app.ingternal.device.arrays.DevicesArray import DevicesArray
# from app.ingternal.device.exceptions.device import DeviceNotFound, DeviceFieldNotFound
# from app.ingternal.device.interface.device_class import IDevice, IField
# from app.ingternal.device.schemas.enums import TypeDeviceField

# logger = logging.getLogger(__name__)


# def normalize_binary_value(field:IField, value: str) -> Union[str, int, bool]:
#     """Приведение бинарного значения к high/low если они заданы."""
#     value_lower = value.lower()
#     if field.get_high() is not None and value_lower in ("1", "true"):
#         return field.get_high()
#     if field.get_low() is not None and value_lower in ("0", "false"):
#         return field.get_low()
#     return value


# def normalize_numeric_value(field: IField, value: str) -> Union[str, int, float]:
#     """Ограничение числа в пределах high/low если они заданы."""
#     try:
#         numeric = float(value) if "." in value else int(value)
#     except ValueError:
#         logger.warning(f"Value '{value}' is not numeric, using as-is.")
#         return value

#     if field.get_high() is not None and numeric > float(field.get_high()):
#         return float(field.get_high())
#     if field.get_low() is not None and numeric < float(field.get_low()):
#         return float(field.get_low())
#     return numeric


# async def set_status_for_device(device: IDevice, field_id: str, value: str) -> None:
#     """Устанавливает статус устройства с учетом типа поля и ограничений."""
#     field = device.get_field(field_id)
#     if field is None:
#         raise DeviceFieldNotFound(f"Field '{field_id}' not found in device '{device.data.system_name}'.")

#     if field.get_type() == TypeDeviceField.BINARY:
#         final_value = normalize_binary_value(field, value)
#     elif field.get_type() == TypeDeviceField.NUMBER:
#         final_value = normalize_numeric_value(field, value)
#     else:
#         final_value = value

#     await device.set_value(field_id, final_value)
#     logger.info(f"Status for device '{device.data.system_name}', field '{field_id}' set to '{final_value}'")


# async def set_status(system_name: str, field_id: str, value: str) -> None:
#     """Асинхронная установка значения без учета типа поля (прямой вызов)."""
#     logger.info(f"Attempting to set status for device '{system_name}', field '{field_id}' with value '{value}'")

#     device_cond = DevicesArray.get(system_name)
#     if not device_cond:
#         logger.error(f"Device '{system_name}' not found.")
#         raise DeviceNotFound(f"Device '{system_name}' not found.")

#     try:
#         await device_cond.device.set_value(field_id, value)
#         logger.info(f"Successfully set status for device '{system_name}', field '{field_id}' to '{value}'")
#     except Exception as e:
#         logger.error(f"Error setting value for device '{system_name}', field '{field_id}': {e}")
#         raise


# async def set_status_correct(system_name: str, field_id: str, value: str) -> None:
#     """Асинхронная установка значения с учетом типа поля и ограничений."""
#     logger.info(f"Attempting to set corrected status for device '{system_name}', field '{field_id}' with value '{value}'")

#     device_cond = DevicesArray.get(system_name)
#     if not device_cond:
#         logger.error(f"Device '{system_name}' not found.")
#         raise DeviceNotFound(f"Device '{system_name}' not found.")

#     try:
#         await set_status_for_device(device_cond.device, field_id, value)
#     except Exception as e:
#         logger.error(f"Error setting corrected value for device '{system_name}', field '{field_id}': {e}")
#         raise
