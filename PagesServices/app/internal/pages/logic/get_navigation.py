import os
import yaml
from app.configuration.settings import CONFIG_DIR

def load_navigation_configs():
    result = []
    for module_name in os.listdir(CONFIG_DIR):
        nav_path = os.path.join(CONFIG_DIR, module_name, "navigation.yml")
        if os.path.isfile(nav_path):
            with open(nav_path, 'r') as f:
                data = yaml.safe_load(f)
                result.append(data)
    return result
