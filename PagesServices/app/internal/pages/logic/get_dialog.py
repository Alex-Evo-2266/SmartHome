import os, json
from app.configuration.settings import BASE_DIR
from .utils import json_read

def get_dialog_path(__name__)->dict[str, str]:
    module_dialog_dir = os.path.join(BASE_DIR, *__name__.split('.'), 'dialogs')
    if not os.path.isdir(module_dialog_dir):
        return {}
    dialogs_path = {}
    for name in os.listdir(module_dialog_dir):
        split_name = name.split('.')
        if len(split_name) == 2 and split_name[1] == 'json':
            dialogs_path[split_name[0]] = os.path.join(module_dialog_dir, name)
    return dialogs_path

def get_dialog_data(path:str):
    dialog = json_read(path)
    print(dialog)
    return dialog

def get_dialogs_data(paths:list[str]):
    dialogs = []
    for path in paths:
        dialog = json_read(paths[path])
        dialogs.append(dialog)
    print(dialogs)
    return dialogs