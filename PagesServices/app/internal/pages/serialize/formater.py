# from ..schemas.components import Component, Action, ComponentType, ColumnElement, TypeSrc


# def mapComponent(data, formaters:dict):
#     if 'action' in data:
#         action = Action(**data["action"])
#         data["action"] = action
#     if 'value' in data and isinstance(data['value'], list) and data['type'] == ComponentType.COLUMNS:
#         value = []
#         for val_item in data['value']:
#             value.append(ColumnElement(indexCol=val_item['indexCol'], value=mapComponent(val_item['value'], formaters)))
#         data['value'] = value
#     if 'value' in data and isinstance(data['value'], list):
#         value = []
#         for val_item in data['value']:
#             value.append(mapComponent(val_item, formaters))
#         data['value'] = value
#     elif 'value' in data and isinstance(data['value'], dict):
#         value = mapComponent(data['value'], formaters)
#         data['value'] = value
#     if 'src' in data and data['src'] == TypeSrc.SERVER_GENERATE and 'src_key' in data != None and data['src_key'] in formaters:
#         f = formaters[data['src_key']]
#         data['value'] = f()
#     return Component(**data)


from ..schemas.components import Component, Action, ComponentType, ColumnElement, TypeSrc
import logging

logger = logging.getLogger(__name__)

def mapComponent(data, formaters: dict):
    if not data:
        return Component(type=ComponentType.TEXT, name="")
    try:
        # Логируем входные данные для диагностики
        logger.debug(f"Mapping component with data: {data}")

        if 'action' in data:
            action = Action(**data["action"])
            data["action"] = action

        if 'value' in data and isinstance(data['value'], list) and data['type'] == ComponentType.COLUMNS:
            value = []
            for val_item in data['value']:
                value.append(ColumnElement(indexCol=val_item['indexCol'], value=mapComponent(val_item['value'], formaters)))
            data['value'] = value

        if 'value' in data and isinstance(data['value'], list):
            value = []
            for val_item in data['value']:
                value.append(mapComponent(val_item, formaters))
            data['value'] = value

        elif 'value' in data and isinstance(data['value'], dict):
            value = mapComponent(data['value'], formaters)
            data['value'] = value

        if 'src' in data and data['src'] == TypeSrc.SERVER_GENERATE and 'src_key' in data and data['src_key'] in formaters:
            f = formaters[data['src_key']]
            print("ppp999999", f)
            formatted_data = f()  # Получаем данные от форматтера
            logger.debug(f"Formatted data from {data['src_key']}: {formatted_data}")

            # Проверяем, что formatted_data содержит ожидаемые ключи
            if isinstance(formatted_data, dict) and 'zigbee2mqtt/bridge' not in formatted_data:
                logger.warning(f"Key 'zigbee2mqtt/bridge' not found in formatted data from {data['src_key']}")
                formatted_data['zigbee2mqtt/bridge'] = {}  # Добавляем значение по умолчанию

            data['value'] = formatted_data

        return Component(**data)

    except Exception as e:
        logger.error(f"Error in mapComponent: {e}", exc_info=True)
        raise  # Повторно выбрасываем исключение для обработки на уровне выше