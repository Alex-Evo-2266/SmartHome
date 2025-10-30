import os
import shutil, json
from app.configuration.settings import MODULES_DIR
from app.internal.module.run_module import stop_module_in_container, remove_module_containers
from app.internal.module.install_module import clone_module
from app.internal.module.run_module import build_module_in_container

def update_module(name: str, token: str | None = None, base_dir: str = MODULES_DIR):
    """
    Останавливает и удаляет контейнеры модуля, затем удаляет его файлы и конфиг.
    """
    module_dir = os.path.join(base_dir, name)

    # 1️⃣ Остановить все контейнеры модуля
    stop_module_in_container(name)

    # 2️⃣ Удалить контейнеры (docker compose down)
    remove_module_containers(name)

    # 3️⃣ Удалить сам модуль
    if os.path.exists(module_dir):
        try:
            shutil.rmtree(module_dir)
            print(f"✅ Модуль '{module_dir}' удалён.")
        except Exception as e:
            print(f"⚠️ Ошибка при удалении модуля '{module_dir}': {e}")

    # 4️⃣ установка
    clone_module(name, token, base_dir)
    build_module_in_container(name)