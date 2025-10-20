import os
import shutil
from app.configuration.settings import CONFIG_SERVICES_DIR, MODULES_DIR, CORE_MODULES_DIR
from app.internal.module.run_module import stop_module_in_container, remove_module_containers

def remove_module(name: str):
    """
    Останавливает и удаляет контейнеры модуля, затем удаляет его файлы и конфиг.
    """
    module_dir = os.path.join(MODULES_DIR, name)
    config_dir = os.path.join(CONFIG_SERVICES_DIR, name)

    # 1️⃣ Остановить все контейнеры модуля
    stop_module_in_container(name)

    # 2️⃣ Удалить контейнеры (docker compose down)
    remove_module_containers(name)

    # 3️⃣ Удалить папки модуля и конфига
    for path, label in [(module_dir, "Модуль"), (config_dir, "Конфиг")]:
        if os.path.exists(path):
            try:
                shutil.rmtree(path)
                print(f"✅ {label} '{path}' удалён.")
            except Exception as e:
                print(f"⚠️ Ошибка при удалении {label.lower()} '{path}': {e}")
        else:
            print(f"ℹ️ {label} '{path}' не найден.")

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