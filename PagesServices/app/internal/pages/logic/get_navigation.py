import os
import yaml
from app.configuration.settings import CONFIG_SERVICES_DIR, PREFIX_PATH
from app.internal.pages.schemas.navigation import Navigation, NavigationData

def load_navigation_configs() -> NavigationData:
    result = []
    for module_name in os.listdir(CONFIG_SERVICES_DIR):
        nav_path = os.path.join(CONFIG_SERVICES_DIR, module_name, "navigation.yml")
        if os.path.isfile(nav_path):
            with open(nav_path, 'r') as f:
                data = yaml.safe_load(f)
                if data:  # проверка, что файл не пустой
                    # если структура файла — список словарей
                    for entry in data:
                        result.append(Navigation(**entry))
    return NavigationData(pages=result, prefix=PREFIX_PATH)