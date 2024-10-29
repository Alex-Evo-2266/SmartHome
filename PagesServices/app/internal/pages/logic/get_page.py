import os, json
from app.configuration.settings import BASE_DIR

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

def js_r(filename: str):
    with open(filename) as f_in:
        return json.load(f_in)

def get_page_data(path:str):
    page = js_r(path)
    print(page)
    return page