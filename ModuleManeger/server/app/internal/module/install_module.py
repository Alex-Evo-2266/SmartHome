import os
import yaml
import subprocess
from typing import Dict
import json
from datetime import datetime
from app.internal.module.search_modules import get_all_modules
from app.configuration.settings import URL_REPO_MODULES_LIST, MODULES_DIR, CONFIG_SERVICES_DIR, DATA_FILE
from app.internal.module.schemas.modules import ModulesConf

def clone_module(name: str, token: str | None = None, base_dir: str = MODULES_DIR):
    modules = get_all_modules(URL_REPO_MODULES_LIST, token=token, force_refresh=False)
    for repo_url, config in modules.items():
        if(config.name_module == name):
            return clone_module_repo(repo_url, config.name_module, base_dir)


def clone_module_repo(repo_url: str, name_module: str, base_dir: str = MODULES_DIR) -> str:
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
    generate_docker_compose_from_module(final_dir)
    save_module_meta(final_dir, name)

    return final_dir


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

def generate_docker_compose_from_module(module_path: str, output_path: str = None):
    """
    Генерирует docker-compose.yml на основе module-config.yml в указанном модуле.

    :param module_path: Путь к директории модуля, где лежит module-config.yml
    :param output_path: Путь для сохранения docker-compose.yml (по умолчанию в ту же папку)
    """
    config_path = os.path.join(module_path, "module-config.yml")
    if not os.path.exists(config_path):
        print(f"❌ Не найден module-config.yml: {config_path}")
        return False

    with open(config_path, "r", encoding="utf-8") as f:
        try:
            config = yaml.safe_load(f)
        except yaml.YAMLError as e:
            print(f"⚠️ Ошибка чтения YAML: {e}")
            return False

    containers = config.get("containers", [])
    if not containers:
        print("⚠️ В module-config.yml отсутствует поле 'containers'.")
        return False

    compose_data = {"services": {}, "networks": {
        "local_sh_network": {
            "name": "${NETWORK_NAME}",
            "external": True
        }
    }}

    for container in containers:
        name = container.get("name")
        conf = container.get("config", {})

        if not name:
            print("⚠️ Пропущен контейнер без имени — пропускаем.")
            continue

        # Добавляем сеть
        if not ("network_mode" in conf and conf["network_mode"] == "host"):
            conf.setdefault("networks", [])
            if "local_sh_network" not in conf["networks"]:
                conf["networks"].append("local_sh_network")

        # Добавляем контейнер в services
        compose_data["services"][name] = {
            "container_name": name,
            **conf
        }

    # Определяем путь для сохранения
    if not output_path:
        output_path = os.path.join(module_path, "docker-compose.yml")

    with open(output_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(compose_data, f, sort_keys=False, allow_unicode=True)

    print(f"✅ docker-compose.yml успешно создан: {output_path}")
    return True


def save_module_meta(module_path: str, module_name: str):
    """
    Сохраняет метаданные модуля (контейнеры, конфиги и т.д.) в meta.json.
    """
    config_path = os.path.join(module_path, "module-config.yml")
    meta_path = os.path.join(module_path, "modules_meta.json")

    if not os.path.exists(config_path):
        print(f"⚠️ Не найден module-config.yml: {config_path}")
        return

    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    containers = config.get("containers", [])
    config_paths = []

    # Извлекаем пути volume из контейнеров
    for container in containers:
        conf = container.get("config", {})
        vols = conf.get("volumes", [])
        for v in vols:
            # Берем левую часть volume и подставляем MODULE_NAME
            left = v.split(":")[0]
            if "${CONFIGURATE_DIR}" in left:
                left = left.replace("${CONFIGURATE_DIR}/", "")
                left = left.replace("__MODULE_NAME__", module_name)
                config_paths.append(os.path.join(CONFIG_SERVICES_DIR, left))

    # Удаляем дубликаты
    config_paths = list(dict.fromkeys(config_paths))

    meta = {
        "module_name": module_name,
        "containers": [c.get("name") for c in containers if c.get("name")],
        "config_paths": config_paths,
        "created_at": datetime.utcnow().isoformat()
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    print(f"📝 Метаданные сохранены: {meta_path}")
