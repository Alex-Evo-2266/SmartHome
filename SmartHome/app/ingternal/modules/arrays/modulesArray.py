import os
import yaml
import subprocess
import importlib
import logging
from pathlib import Path
from typing import Callable, Dict, Optional, List

from app.configuration.settings import MODULS_DIR

# Настройка логгера
logger = logging.getLogger(__name__)

def get_modules(directory: str, init: bool = True) -> List[str]:
    """Возвращает список имен модулей в указанной директории."""
    path = Path(directory)

    if not path.exists() or not path.is_dir():
        logger.error(f"Директория {directory} не найдена или не является папкой.")
        return []

    modules = [item.name for item in path.iterdir() if item.is_dir() or item.suffix == ".py"]

    if not init and '__init__.py' in modules:
        modules.remove('__init__.py')
    if "__pycache__" in modules:
        modules.remove("__pycache__")

    return modules

def check_and_install_packages(required_packages: List[str]):
    """Проверяет и устанавливает отсутствующие пакеты с помощью Poetry."""
    for package in required_packages:
        if not is_package_installed(package):
            logger.info(f"Пакет {package} не установлен. Устанавливаем через Poetry...")
            install_package(package)
        else:
            logger.info(f"Пакет {package} уже установлен.")

def is_package_installed(package: str) -> bool:
    """Проверяет, установлен ли пакет."""
    try:
        importlib.import_module(package)
        return True
    except ImportError:
        return False

def install_package(package: str):
    """Устанавливает пакет через Poetry."""
    try:
        result = subprocess.run(
            ["poetry", "add", package], check=True, capture_output=True, text=True
        )
        logger.info(f"Пакет {package} успешно установлен:\n{result.stdout}")
    except subprocess.CalledProcessError as e:
        logger.error(f"Ошибка при установке {package}: {e.stderr}")
        raise RuntimeError(f"Не удалось установить пакет {package}. Ошибка: {e.stderr}")



class ModulesArray:
    modules: Dict[str, Optional[type]] = {}

    @classmethod
    def init_modules(cls, name: str) -> None:
        """Инициализирует и регистрирует все модули в указанном пакете."""
        path = os.path.join(*name.split('.'))
        modules_name = get_modules(path, init=False)
        for module_name in modules_name:
            try:

                # Импортируем модуль
                logger.info(f"Попытка импорта модуля {module_name}: {name}.{module_name}")
                module = importlib.import_module(f"{name}.{module_name}")
                
                # Проверяем наличие атрибута 'Module'
                if hasattr(module, 'Module'):
                    cls.register(module_name, module.Module)
                else:
                    logger.warning(f"В модуле {module_name} не найден атрибут 'Module'.")
            except ImportError as e:
                logger.error(f"Ошибка при импорте модуля {module_name}: {e}")

    @classmethod
    def install_dependencies(cls, name: str):
        """Устанавливает зависимости из config.yaml, если он существует."""
        path = Path(name.replace(".", os.sep))
        modules_name = get_modules(str(path), init=False)

        for module_name in modules_name:
            config_path = Path(MODULS_DIR) / module_name / "config.yaml"
            if config_path.exists():
                try:
                    with config_path.open("r") as file:
                        config = yaml.safe_load(file)
                        dependencies = config.get("dependencies", [])
                        if dependencies:
                            check_and_install_packages(dependencies)
                except Exception:
                    logger.exception(f"Ошибка при чтении {config_path}")
            else:
                logger.info(f"Файл config.yaml не найден в {module_name}")


    @classmethod
    def register(cls, name: str, module: type) -> None:
        """Регистрирует модуль под указанным именем."""
        cls.modules[name] = module

    @classmethod
    async def start(cls) -> None:
        """Запускает все зарегистрированные модули."""
        for name, module in cls.modules.items():
            if hasattr(module, 'start'):
                logger.info(f"Запуск модуля {name}")
                await module.start()

    @classmethod
    async def stop(cls) -> None:
        """Останавливает все зарегистрированные модули."""
        for name, module in cls.modules.items():
            if hasattr(module, 'stop'):
                logger.info(f"Остановка модуля {name}")
                await module.stop()

    @classmethod
    def for_each(cls, callback: Callable) -> None:
        """Применяет функцию обратного вызова ко всем зарегистрированным модулям."""
        for _, module in cls.modules.items():
            callback(module)

    @classmethod
    def get(cls, name_module: str) -> Optional[type]:
        """Возвращает модуль по имени, или None, если не найден."""
        return cls.modules.get(name_module)

    @classmethod
    def routers(cls) -> list:
        """Возвращает список роутеров всех зарегистрированных модулей."""
        routers = []
        for name, module in cls.modules.items():
            if hasattr(module, 'router'):
                routers.append(module.router)
        return routers