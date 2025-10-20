import os, json
from app.configuration.settings import BASE_DIR
from .utils import json_read

def get_menu_path(__name__)->dict[str, str]:
    module_menu_dir = os.path.join(BASE_DIR, *__name__.split('.'), 'menu')
    if not os.path.isdir(module_menu_dir):
        return {}
    menus_path = {}
    for name in os.listdir(module_menu_dir):
        split_name = name.split('.')
        if len(split_name) == 2 and split_name[1] == 'json':
            menus_path[split_name[0]] = os.path.join(module_menu_dir, name)
    return menus_path

def get_all_menu_data(paths:list[str]):
    menus = []
    for path in paths:
        menu = json_read(paths[path])
        menus.append(menu)
    return menus