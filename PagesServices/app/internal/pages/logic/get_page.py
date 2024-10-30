import os
from app.configuration.settings import BASE_DIR
from .utils import json_read

def get_pages_path(__name__)->dict[str, str]:
    module_page_dir = os.path.join(BASE_DIR, *__name__.split('.'), 'pages')
    if not os.path.isdir(module_page_dir):
        return {}
    pages_path = {}
    for name in os.listdir(module_page_dir):
        split_name = name.split('.')
        if len(split_name) == 2 and split_name[1] == 'json':
            pages_path[split_name[0]] = os.path.join(module_page_dir, name)
    return pages_path



def get_page_data(path:str):
    page = json_read(path)
    print(page)
    return page