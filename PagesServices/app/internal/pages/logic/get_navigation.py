import os
import yaml
from app.configuration.settings import CONFIG_SERVICES_DIR, PREFIX_PATH
from app.internal.pages.schemas.navigation import Navigation, NavigationData
from app.internal.pages.logic.modulesArray import ModulesArray

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
    for module_name, module in ModulesArray.get_all().items():
        for key, file in module.pages_path.items():
            result.append(Navigation(
                service=module_name,
                path=f"/{key}",
                type="module",
                host="page_service:8007",
                name=key,
                full_path=f"page_service:8007/{key}",
                page_name=key,
                file=file
            ))
    return NavigationData(pages=result, prefix=PREFIX_PATH)