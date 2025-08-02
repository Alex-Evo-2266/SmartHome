import os
import yaml
from app.configuration.settings import CONFIG_SERVICES_DIR
from typing import List
from app.internal.auth.schemas.auth import ConfigFilePageData
from app.internal.auth.exceptions.config import ConfigNotFoundException

def load_auth_configs() -> List[ConfigFilePageData]:
    result: List[ConfigFilePageData] = []
    try:
        for module_name in os.listdir(CONFIG_SERVICES_DIR):
            nav_path = os.path.join(CONFIG_SERVICES_DIR, module_name, "auth.yml")
            if os.path.isfile(nav_path):
                with open(nav_path, 'r') as f:
                    data = yaml.safe_load(f)
                    if data:  # проверка, что файл не пустой
                        if "pages" in data:
                            for page in data["pages"]:
                                if "service" in page:
                                    result.append(ConfigFilePageData(
                                        roles=page.get("roles", []),
                                        iframe_only=page.get("iframe_only", False),
                                        service=page["service"],
                                        path=page.get("path", None),
                                        full_path=page.get("full_path", None)
                                    ))
    except Exception as e:
        print(e)
    return result

def service_config(name, path: str = "/"):

    configs = load_auth_configs()
    print(configs, name, path)
    config_cond = [item for item in configs if item.service == name and item.path == path]
    if len(config_cond) < 1:
        raise ConfigNotFoundException()
    return config_cond[0]