from app.pkg.logger import MyLogger
from app.core.ports.interface.field_class import IField
from typing import Union

logger = MyLogger().get_logger(__name__)


def normalize_binary_value(field:IField, value: str) -> Union[str, int, bool]:
    """Приведение бинарного значения к high/low если они заданы."""
    value_lower = value.lower()
    if field.get_high() is not None and value_lower in ("1", "true"):
        return field.get_high()
    if field.get_low() is not None and value_lower in ("0", "false"):
        return field.get_low()
    return value


def normalize_numeric_value(field: IField, value: str) -> Union[str, int, float]:
    """Ограничение числа в пределах high/low если они заданы."""
    try:
        numeric = float(value) if "." in value else int(value)
    except ValueError:
        logger.warning(f"Value '{value}' is not numeric, using as-is.")
        return value

    if field.get_high() is not None and numeric > float(field.get_high()):
        return float(field.get_high())
    if field.get_low() is not None and numeric < float(field.get_low()):
        return float(field.get_low())
    return numeric

# from app.ingternal.device.schemas.enums import TypeDeviceField
# from typing import Optional

# def normalize_value(value: str | None, field_type: TypeDeviceField, 
#                     min_val: Optional[str] = None, 
#                     max_val: Optional[str] = None) -> str:
#     if value == None:
#         return None
#     # ----- BINARY -----
#     if field_type == TypeDeviceField.BINARY:
#         if min_val is not None and max_val is not None:
#             if value == max_val:
#                 return "true"
#             elif value == min_val:
#                 return "false"
#             else:
#                 # Если пришло что-то странное — возвращаем как есть
#                 return value
#         else:
#             # Если min/max нет, считаем 1 или true за "1"
#             return "true" if value.lower() in ("1", "true") else "false"

#     # ----- NUMBER -----
#     elif field_type == TypeDeviceField.NUMBER:
#         try:
#             num = float(value)
#         except ValueError:
#             return value  # если не число — вернуть как есть
#         if min_val is not None:
#             try:
#                 num = max(num, float(min_val))
#             except ValueError:
#                 pass
#         if max_val is not None:
#             try:
#                 num = min(num, float(max_val))
#             except ValueError:
#                 pass
#         # возвращаем в том же виде (без лишних ".0", если целое)
#         return str(int(num)) if num.is_integer() else str(num)

#     # ----- Остальные типы -----
#     else:
#         return value