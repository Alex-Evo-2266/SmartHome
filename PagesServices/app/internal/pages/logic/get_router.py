import os, importlib
from app.configuration.settings import BASE_DIR

API_DIR = "api"

def get_api(base_dir):
    return base_dir + "." + API_DIR

def get_routers(__name__)->dict[str, str]:
    module_api_dir = os.path.join(BASE_DIR, *__name__.split('.'), 'api')
    if not os.path.isdir(module_api_dir):
        return {}
    routers = []
    for name in os.listdir(module_api_dir):
        split_name = name.split('.')
        if len(split_name) == 2 and split_name[1] == 'py':
            package = get_api(__name__) + '.' + split_name[0]
            routers.append(importlib.import_module(package))
    return routers