import os, importlib
from app.bootstrap.const import BASE_DIR

def get_device(base_dir):
    return base_dir + ".devices"

def init_device_classes(__name__):
    module_api_dir = os.path.join(BASE_DIR, *__name__.split('.'), 'devices')
    if not os.path.isdir(module_api_dir):
        return 
    for name in os.listdir(module_api_dir):
        split_name = name.split('.')
        if len(split_name) == 2 and split_name[1] == 'py':
            package = get_device(__name__) + '.' + split_name[0]
            try:
                importlib.import_module(package)
            except Exception as e:
                print(f"Ошибка при импорте {package}: {e}")