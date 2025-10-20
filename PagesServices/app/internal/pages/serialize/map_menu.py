from ..schemas.menu import Menu, MenuItem, MenuSubItem

def mapSubItems(data):
    if not 'subItems' in data:
        return MenuItem(**data, subItems = None)
    if 'subItems' in data and not isinstance(data['subItems'], list):
        raise Exception(f'incorect menu config')
    items = []
    for item in data['subItems']:
        items.append(MenuSubItem(**item))
    data['subItems'] = items
    return MenuItem(**data)

def mapMenu(data):
    if not 'components' in data or not isinstance(data['components'], list):
        raise Exception(f'incorect menu config {data['name']}')
    items = []
    for item in data['components']:
        items.append(mapSubItems(item))
    return Menu(name=data['name'], components=items)