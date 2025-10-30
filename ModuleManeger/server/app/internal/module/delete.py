import os
import shutil, json
from app.configuration.settings import MODULES_DIR, CORE_MODULES_DIR
from app.internal.module.run_module import stop_module_in_container, remove_module_containers

def remove_module(name: str):
    """
    Останавливает и удаляет контейнеры модуля, затем удаляет его файлы и конфиг.
    """
    module_dir = os.path.join(MODULES_DIR, name)
    meta_path = os.path.join(MODULES_DIR, name, "modules_meta.json")

    # 1️⃣ Остановить все контейнеры модуля
    stop_module_in_container(name)

    # 2️⃣ Удалить контейнеры (docker compose down)
    remove_module_containers(name)

    # 3️⃣ Удалить папки модуля и конфига
    config_paths = []
    if os.path.exists(meta_path):
        try:
            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
                config_paths = meta.get("config_paths", [])
        except Exception as e:
            print(f"⚠️ Ошибка чтения meta.json: {e}")

    # 3️⃣ Удалить указанные в meta.json пути
    print(f"Конфиги '{config_paths}'.")
    for path in config_paths:
        if os.path.exists(path):
            try:
                shutil.rmtree(path)
                print(f"✅ Конфиг '{path}' удалён.")
            except Exception as e:
                print(f"⚠️ Ошибка при удалении '{path}': {e}")
        else:
            print(f"ℹ️ Конфиг '{path}' не найден.")

     # 4️⃣ Удалить сам модуль
    if os.path.exists(module_dir):
        try:
            shutil.rmtree(module_dir)
            print(f"✅ Модуль '{module_dir}' удалён.")
        except Exception as e:
            print(f"⚠️ Ошибка при удалении модуля '{module_dir}': {e}")

def remove_core_module(name: str):

    module_dir = os.path.join(CORE_MODULES_DIR, name)

    for path, label in [(module_dir, "Модуль")]:
        if os.path.exists(path):
            try:
                shutil.rmtree(path)
                print(f"✅ {label} '{path}' удалён.")
            except Exception as e:
                print(f"⚠️ Ошибка при удалении {label.lower()} '{path}': {e}")
        else:
            print(f"ℹ️ {label} '{path}' не найден.")