import os
import subprocess
from typing import Dict
from pathlib import Path
from app.internal.module.search_modules import get_all_modules
from app.configuration.settings import URL_REPO_MODULES_LIST, MODULES_DIR, CONFIG_SERVICES_DIR
from app.internal.module.schemas.modules import ModulesConf

def clone_module(name: str):
    modules = get_all_modules(URL_REPO_MODULES_LIST, token=None, force_refresh=False)
    for repo_url, config in modules.items():
        if(config.name == name):
            return clone_module_repo(repo_url, config)


def clone_module_repo(repo_url: str, config: ModulesConf, base_dir: str = MODULES_DIR) -> str:
    """
    Клонирует репозиторий модуля в папку base_dir.
    Имя папки берётся из config["name"].
    Если папка существует — добавляется число.
    
    Возвращает путь к клонированной папке.
    """
    if config.name == "":
        raise ValueError(f"В конфиге {repo_url} отсутствует поле 'name'")

    base_name = config.name
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

    generate_compose_file(final_dir, name)

    return final_dir


def generate_compose_file(module_dir: str, module_name: str):
    """
    Берёт docker-compose-template.yml в module_dir,
    заменяет __MODULE_NAME__ на module_name,
    сохраняет как docker-compose.yml
    """
    template_path = Path(module_dir) / "docker-compose-template.yml"
    target_path = Path(module_dir) / "docker-compose.yml"

    if not template_path.exists():
        raise FileNotFoundError(f"Не найден {template_path}")

    with open(template_path, "r", encoding="utf-8") as f:
        content = f.read()

    # заменяем все __MODULE_NAME__
    content = content.replace("__MODULE_NAME__", module_name)
    content = content.replace("__CONFIG__", CONFIG_SERVICES_DIR)

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(content)

    return target_path