# import os, importlib
# from app.internal.pages.classes.BaseModules import BaseModule
# from typing import Dict

# def getModuls(dir=__name__, init = True):
#     list_modules=os.listdir(dir)
#     if not init and '__init__.py' in list_modules:
#         list_modules.remove('__init__.py')
#     if "__pycache__" in list_modules:
#         list_modules.remove("__pycache__")
#     return list_modules

# class ModulesArray():

#     madules:Dict[str, BaseModule] = {}

#     @classmethod
#     def initModules(cls, name:str):
#         path = os.sep.join(name.split('.'))
#         modules_name = getModuls(path, False)
#         for module_name in modules_name:
#             module = importlib.import_module(name + "." + module_name)
#             cls.register(module_name, module.Module)

#     @classmethod
#     def register(cls, name, module):
#         cls.madules[name] = module

#     @classmethod
#     def start(cls):
#         for name in cls.madules:
#             cls.madules[name].start()

#     @classmethod
#     def stop(cls):
#         for name in cls.madules:
#             cls.madules[name].stop()

#     @classmethod
#     def forEtch(cls, clallback):
#         for name in cls.madules:
#             clallback(cls.madules[name])

#     @classmethod
#     def get(cls, name_module: str):
#         return cls.madules[name_module]
    
#     @classmethod
#     def get_all(cls, ):
#         return cls.madules
    
#     @classmethod
#     def routers(cls):
#         routers = []
#         for name in cls.madules:
#             routers.append(cls.madules[name].router)
#         return routers

import os
import importlib
import logging
from typing import Dict, List, Type, Callable, Optional, Any
from pathlib import Path
from app.internal.pages.classes.BaseModules import BaseModule
from app.internal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

def get_modules(directory: str = __name__, exclude_init: bool = True) -> List[str]:
    """
    Получает список модулей в указанной директории.
    
    Args:
        directory: Путь к директории (по умолчанию текущий модуль)
        exclude_init: Исключать ли __init__.py (по умолчанию True)
        
    Returns:
        Список имен модулей
        
    Raises:
        FileNotFoundError: Если директория не существует
    """
    try:
        dir_path = Path(directory)
        if not dir_path.exists():
            raise FileNotFoundError(f"Directory not found: {directory}")
        
        modules = []
        for item in dir_path.iterdir():
            if item.name == "__pycache__":
                continue
            if exclude_init and item.name == "__init__.py":
                continue
            if item.suffix == ".py" or (item.is_dir() and (item / "__init__.py").exists()):
                modules.append(item.stem)
        
        logger.debug(f"Found {len(modules)} modules in {directory}")
        return modules
        
    except Exception as e:
        logger.error(f"Error getting modules from {directory}: {str(e)}", exc_info=True)
        raise

class ModulesArray:
    """
    Класс для управления коллекцией модулей.
    
    Attributes:
        modules: Словарь зарегистрированных модулей {имя: модуль}
    """
    
    modules: Dict[str, Type[BaseModule]] = {}

    @classmethod
    def init_modules(cls, module_path: str) -> None:
        """
        Инициализирует все модули в указанном пути.
        
        Args:
            module_path: Путь к модулям в формате 'package.subpackage'
            
        Raises:
            ImportError: Если не удалось импортировать модуль
        """
        try:
            path_components = module_path.split('.')
            dir_path = Path(*path_components)
            
            if not dir_path.exists():
                raise FileNotFoundError(f"Module path not found: {dir_path}")
            
            module_names = get_modules(str(dir_path), exclude_init=True)
            
            for name in module_names:
                full_path = f"{module_path}.{name}"
                try:
                    module = importlib.import_module(full_path)
                    if hasattr(module, 'Module'):
                        cls.register(name, module.Module)
                        logger.info(f"Successfully initialized module: {name}")
                    else:
                        logger.warning(f"Module {name} doesn't have 'Module' class")
                except Exception as e:
                    logger.error(f"Failed to initialize module {name}: {str(e)}", exc_info=True)
                    raise ImportError(f"Could not import module {full_path}") from e
                    
        except Exception as e:
            logger.error(f"Error initializing modules: {str(e)}", exc_info=True)
            raise

    @classmethod
    def register(cls, name: str, module: Type[BaseModule]) -> None:
        """
        Регистрирует модуль.
        
        Args:
            name: Имя модуля
            module: Класс модуля (должен наследовать BaseModule)
            
        Raises:
            TypeError: Если модуль не наследует BaseModule
        """
        if not issubclass(module, BaseModule):
            error_msg = f"Module {name} must inherit from BaseModule"
            logger.error(error_msg)
            raise TypeError(error_msg)
            
        cls.modules[name] = module
        logger.debug(f"Registered module: {name}")

    @classmethod
    def start(cls) -> None:
        """Запускает все зарегистрированные модули."""
        logger.info("Starting all modules")
        for name, module in cls.modules.items():
            try:
                module.start()
                logger.debug(f"Started module: {name}")
            except Exception as e:
                logger.error(f"Error starting module {name}: {str(e)}", exc_info=True)

    @classmethod
    def stop(cls) -> None:
        """Останавливает все зарегистрированные модули."""
        logger.info("Stopping all modules")
        for name, module in cls.modules.items():
            try:
                module.stop()
                logger.debug(f"Stopped module: {name}")
            except Exception as e:
                logger.error(f"Error stopping module {name}: {str(e)}", exc_info=True)

    @classmethod
    def for_each(cls, callback: Callable[[Type[BaseModule]], Any]) -> None:
        """
        Применяет callback-функцию к каждому модулю.
        
        Args:
            callback: Функция, принимающая модуль
        """
        for name, module in cls.modules.items():
            try:
                callback(module)
                logger.debug(f"Applied callback to module: {name}")
            except Exception as e:
                logger.error(f"Error in callback for module {name}: {str(e)}", exc_info=True)

    @classmethod
    def get(cls, name: str) -> Optional[Type[BaseModule]]:
        """
        Получает модуль по имени.
        
        Args:
            name: Имя модуля
            
        Returns:
            Класс модуля или None если не найден
        """
        module = cls.modules.get(name)
        if module is None:
            logger.warning(f"Module not found: {name}")
        return module

    @classmethod
    def get_all(cls) -> Dict[str, Type[BaseModule]]:
        """Возвращает все зарегистрированные модули."""
        return cls.modules

    @classmethod
    def routers(cls) -> List[Any]:
        """
        Возвращает список роутеров всех модулей.
        
        Returns:
            Список роутеров
        """
        routers = []
        for name, module in cls.modules.items():
            if hasattr(module, 'router'):
                routers.append(module.router)
                logger.debug(f"Added router from module: {name}")
            else:
                logger.warning(f"Module {name} doesn't have a router")
        return routers