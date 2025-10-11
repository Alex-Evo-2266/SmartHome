import os
import json
import requests
import yaml
from typing import Dict, Any, List
from app.configuration.settings import CACHE_FILE
from app.internal.module.schemas.modules import ModulesConfAndLoad

def ensure_cache_file(path: str):
    if not os.path.exists(path):
        print(f"⚡ Кеш {path} не найден — создаём новый.")
        save_cache(path, {})

def load_cache(path: str) -> dict:
    ensure_cache_file(path)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_cache(path: str, data: dict):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def github_get_file_content(owner: str, repo: str, path: str, token: str = None) -> str:
    """Получает содержимое файла через GitHub API"""
    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    headers = {"Authorization": f"token {token}"} if token else {}

    try:
        resp = requests.get(api_url, headers=headers)
        resp.raise_for_status()
        content_data = resp.json()
        if "content" in content_data and content_data["encoding"] == "base64":
            import base64
            decoded = base64.b64decode(content_data["content"]).decode("utf-8")
            return decoded
    except Exception as e:
        print(f"Ошибка при получении содержимого {api_url}: {e}")
    return ""

def get_root_module_config_with_cache(repo_url: str, token: str = None, force_refresh: bool = False) -> Dict[str, Any]:
    """Получает module_config.yml из корня репозитория (с кешированием, как словарь)"""
    ensure_cache_file(CACHE_FILE)
    cache = load_cache(CACHE_FILE)

    if not force_refresh and repo_url in cache:
        print(f"📂 Используем кеш для {repo_url}")
        return cache[repo_url]

    parts = repo_url.rstrip("/").split("/")
    owner, repo = parts[-2], parts[-1]

    print(f"🔍 Проверяем {repo_url} на наличие module_config.yml в корне...")

    # Получаем список файлов в корне
    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents/"
    headers = {"Authorization": f"token {token}"} if token else {}
    try:
        resp = requests.get(api_url, headers=headers)
        resp.raise_for_status()
    except Exception as e:
        print(f"Ошибка при запросе {api_url}: {e}")
        return {}

    files = resp.json()
    config_data = {}
    for file in files:
        if file["type"] == "file" and file["name"] == "module_config.yml":
            print(f"📄 Нашли module_config.yml в {repo}")
            content = github_get_file_content(owner, repo, "module_config.yml", token)
            try:
                config_data = yaml.safe_load(content)
            except yaml.YAMLError as e:
                print(f"Ошибка парсинга YAML в {repo}: {e}")
            break

    cache[repo_url] = config_data
    save_cache(CACHE_FILE, cache)
    return cache[repo_url]

def load_modules_list(list_repo_url: str, token: str = None) -> List[str]:
    """Загружает modules.json из репозитория со списком модулей"""
    parts = list_repo_url.rstrip("/").split("/")
    owner, repo = parts[-2], parts[-1]

    print(f"📥 Загружаем modules.json из {list_repo_url}...")
    content = github_get_file_content(owner, repo, "modules.json", token)
    try:
        modules = json.loads(content)
        return modules
    except Exception as e:
        print(f"Ошибка парсинга modules.json: {e}")
        return []

def get_all_modules(
    list_repo_url: str,
    token: str = None,
    force_refresh: bool = False,
    no_cash: bool = False
) -> Dict[str, ModulesConfAndLoad]:
    """
    Главная функция: собирает все module_config.yml из списка modules.json
    и приводит к Dict[str, ModulesConf]
    """
    repos = load_modules_list(list_repo_url, token)
    result: Dict[str, ModulesConfAndLoad] = {}

    for repo_url in repos:
        config_dict = get_root_module_config_with_cache(
            repo_url,
            token,
            force_refresh or no_cash   # если no_cash=True -> игнорируем кеш
        )
        if not config_dict:
            continue
        try:
            result[repo_url] = ModulesConfAndLoad.parse_obj(config_dict)
        except Exception as e:
            print(f"⚠️ Ошибка валидации module_config.yml для {repo_url}: {e}")

    return result