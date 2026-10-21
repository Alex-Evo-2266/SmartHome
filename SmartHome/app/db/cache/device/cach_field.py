from async_lru import alru_cache
from typing import Optional, List, Tuple

from app.db.models.device.device import Value, DeviceField
from app.schemas.device.enums import StatusDevice
from app.pkg.logger import MyLogger
from pydantic import BaseModel
from ormar.exceptions import NoMatch

logger = MyLogger().get_logger(__name__)


# Кеш последних значений
@alru_cache(maxsize=1000)
async def get_cached_last_value(
    field_id: str,
) -> Tuple[Optional[str], Optional[StatusDevice]]:
    logger.debug("Получение последнего значения поля из БД: field_id=%s", field_id)

    try:
        value: Value = await (
            Value.objects
            .filter(field__id=field_id)
            .order_by("-datatime")
            .first()
        )

        if value:
            result = (str(value.value), value.status_device)
            logger.debug(
                "Последнее значение поля получено: field_id=%s, value=%s, status=%s",
                field_id,
                result[0],
                result[1],
            )
            return result

        logger.debug(
            "Значение для поля не найдено: field_id=%s",
            field_id,
        )
        return (None, None)

    except NoMatch:
        logger.debug(
            "Значение поля ещё не записано: field_id=%s",
            field_id,
        )
        return None, None

    except Exception:
        logger.exception(
            "Ошибка получения последнего значения поля: field_id=%s",
            field_id,
        )
        return (None, None)


# Функция для инвалидации кеша
def invalidate_cache_for_field(field_id: str):
    logger.debug(
        "Инвалидация кеша последнего значения: field_id=%s",
        field_id,
    )

    invalidated = get_cached_last_value.cache_invalidate(field_id)

    logger.debug(
        "Инвалидация кеша последнего значения завершена: field_id=%s, invalidated=%s",
        field_id,
        invalidated,
    )


class CachFieldData(BaseModel):
    id: str
    name: str


@alru_cache(maxsize=1000)
async def get_cached_fields(
    system_name: str,
) -> Optional[List[CachFieldData]]:
    logger.debug(
        "Получение списка полей устройства из БД: system_name=%s",
        system_name,
    )

    try:
        fields: List[DeviceField] = await (
            DeviceField.objects
            .filter(device=system_name)
            .all()
        )

        result = [
            CachFieldData(id=item.id, name=item.name)
            for item in fields
        ]

        logger.debug(
            "Список полей устройства получен: system_name=%s, count=%d",
            system_name,
            len(result),
        )

        return result

    except Exception:
        logger.exception(
            "Ошибка получения списка полей устройства: system_name=%s",
            system_name,
        )
        return None


def invalidate_cache_field(system_name: str):
    logger.debug(
        "Инвалидация кеша полей устройства: system_name=%s",
        system_name,
    )

    invalidated = get_cached_fields.cache_invalidate(system_name)

    logger.debug(
        "Инвалидация кеша полей устройства завершена: system_name=%s, invalidated=%s",
        system_name,
        invalidated,
    )