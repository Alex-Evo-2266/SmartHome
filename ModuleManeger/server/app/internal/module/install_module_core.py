import os
import yaml
import subprocess
from typing import Dict
from pathlib import Path
from app.internal.module.search_modules import get_all_modules
from app.configuration.settings import URL_REPO_MODULES_LIST, CORE_MODULES_DIR, CONFIG_SERVICES_DIR
from app.internal.module.schemas.modules import ModulesConf
from app.internal.module.get_by_label import get_device_container
from app.internal.module.restart import restart_container

TYPE_CORE = "core"

def clone_module(name: str, token: str | None = None, base_dir: str = CORE_MODULES_DIR, type: str = TYPE_CORE):
    modules = get_all_modules(URL_REPO_MODULES_LIST, token=token, force_refresh=False, type_module=type)
    for repo_url, config in modules.items():
        if(config.name_module == name):
            return clone_module_repo(repo_url, config.name_module, base_dir)


def clone_module_repo(repo_url: str, name_module: str, base_dir: str = CORE_MODULES_DIR) -> str:
    """
    Клонирует репозиторий модуля в папку base_dir.
    Имя папки берётся из config["name"].
    Если папка существует — добавляется число.
    
    Возвращает путь к клонированной папке.
    """
    if name_module == "":
        raise ValueError(f"В конфиге {repo_url} отсутствует поле 'name'")

    base_name = name_module
    target_dir = os.path.join(base_dir, base_name)

    # Подбираем имя с цифрой, если папка уже есть
    counter = 1
    final_dir = target_dir
    name = base_name
    while os.path.exists(final_dir):
        final_dir = os.path.join(base_dir, f"{base_name}_{counter}")
        name = f"{base_name}_{counter}"
        counter += 1

    # Создаём базовую папку, если её ещё нет
    os.makedirs(base_dir, exist_ok=True)

    print(f"📥 Клонируем {repo_url} в {final_dir}")
    subprocess.run(["git", "clone", repo_url, final_dir], check=True)

    replace_module_name_in_config(final_dir, name)

    config_path_out = os.path.join(final_dir, "module-config.yml")

    try:
        with open(config_path_out, "r", encoding="utf-8") as f:
            config_data = yaml.safe_load(f) or {}
        dependencies = config_data.get("dependencies", [])
        if dependencies:
            print(f"📦 Найдены зависимости: {dependencies}")
            container = get_device_container(["sh-core.core", "sh-core.auth"])
            if container:
                print(f"📦 Найден контейнер: {container.container_id}")

                for dep in dependencies:
                    subprocess.run(["docker", "exec", container.container_id, "poetry", "add", dep], check=True)
                
                restart_container(container.container_id)
            else:
                print(f"📦 Контейнер не найден")
        else:
            print("ℹ️ Зависимости не указаны.")
        return final_dir
    except Exception as e:
        print(f"⚠️ Ошибка чтения зависимостей: {e}")
        return True, None



def replace_module_name_in_config(module_path: str, module_name: str) -> bool:
    """
    Открывает module-config-template.yml в указанной папке и заменяет все вхождения
    '__MODULE_NAME__' на переданное module_name.

    :param module_path: Путь к директории модуля (где лежит module-config.yml)
    :param module_name: Имя экземпляра модуля для подстановки
    :return: True, если замена выполнена успешно, иначе False
    """
    config_path = os.path.join(module_path, "module-config-template.yml")
    config_path_out = os.path.join(module_path, "module-config.yml")

    if not os.path.exists(config_path):
        print(f"❌ Файл module-config-template.yml не найден: {config_path}")
        return False

    try:
        with open(config_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"⚠️ Ошибка чтения {config_path}: {e}")
        return False

    if "__MODULE_NAME__" not in content:
        print(f"ℹ️ В файле {config_path} нет шаблонов __MODULE_NAME__ — пропускаем.")
        return True

    # Замена
    new_content = content.replace("__MODULE_NAME__", module_name)

    try:
        with open(config_path_out, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ В {config_path_out} заменено __MODULE_NAME__ → {module_name}")
        return True
    except Exception as e:
        print(f"⚠️ Ошибка записи {config_path_out}: {e}")
        return False
