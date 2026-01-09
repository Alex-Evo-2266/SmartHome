from app.ingternal.device.schemas.enums import TypeDeviceField
from typing import Optional

def normalize_value(value: str | None, field_type: TypeDeviceField, 
                    min_val: Optional[str] = None, 
                    max_val: Optional[str] = None) -> str:
    if value == None:
        return None
    # ----- BINARY -----
    if field_type == TypeDeviceField.BINARY:
        if min_val is not None and max_val is not None:
            if value == max_val:
                return "true"
            elif value == min_val:
                return "false"
            else:
                # Если пришло что-то странное — возвращаем как есть
                return value
        else:
            # Если min/max нет, считаем 1 или true за "1"
            return "true" if value.lower() in ("1", "true") else "false"

    # ----- NUMBER -----
    elif field_type == TypeDeviceField.NUMBER:
        try:
            num = float(value)
        except ValueError:
            return value  # если не число — вернуть как есть
        if min_val is not None:
            try:
                num = max(num, float(min_val))
            except ValueError:
                pass
        if max_val is not None:
            try:
                num = min(num, float(max_val))
            except ValueError:
                pass
        # возвращаем в том же виде (без лишних ".0", если целое)
        return str(int(num)) if num.is_integer() else str(num)

    # ----- Остальные типы -----
    else:
        return value