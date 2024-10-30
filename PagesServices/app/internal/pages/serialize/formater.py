from ..test import data
from ..schemas.components import Component, Action, ComponentType, ColumnElement, TypeSrc


def mapComponent(data, formaters:dict):
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
    if 'src' in data and data['src'] == TypeSrc.SERVER_GENERATE and 'src_key' in data != None and data['src_key'] in formaters:
        f = formaters[data['src_key']]
        data['value'] = f()
    return Component(**data)
