import os
import logging
from typing import Dict, List, Optional, Union
from pathlib import Path
from app.configuration.settings import BASE_DIR
from .utils import json_read
from app.internal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

def get_dialog_path(module_name: str) -> Dict[str, str]:
    """
    Получает пути к JSON-файлам диалогов в указанном модуле.
    
    Args:
        module_name: Имя модуля в формате 'package.module'
        
    Returns:
        Словарь {название_диалога: путь_к_файлу}
    """
    try:
        # Преобразуем в Path для кроссплатформенности
        module_dialog_dir = Path(BASE_DIR).joinpath(*module_name.split('.')).joinpath('dialogs')
        logger.debug(f"Поиск диалогов в директории: {module_dialog_dir}")
        
        if not module_dialog_dir.is_dir():
            logger.warning(f"Директория с диалогами не найдена: {module_dialog_dir}")
            return {}
            
        dialogs_path = {}
        for item in module_dialog_dir.iterdir():
            if item.is_file() and item.suffix == '.json':
                logger.debug(f"Найден файл диалога: {item.name}")
                dialogs_path[item.stem] = str(item)
                
        logger.info(f"Найдено {len(dialogs_path)} диалогов в модуле {module_name}")
        return dialogs_path
        
    except Exception as e:
        logger.error(f"Ошибка при поиске диалогов: {str(e)}", exc_info=True)
        return {}

def get_dialog_data(path: str) -> Optional[Union[dict, list]]:
    """
    Читает данные диалога из JSON-файла.
    
    Args:
        path: Путь к JSON-файлу
        
    Returns:
        Данные диалога или None в случае ошибки
    """
    try:
        logger.debug(f"Чтение диалога из файла: {path}")
        dialog = json_read(path)
        logger.debug(f"Успешно прочитан диалог из {path}")
        return dialog
    except Exception as e:
        logger.error(f"Ошибка чтения диалога из {path}: {str(e)}", exc_info=True)
        return None

def get_dialogs_data(paths: Dict[str, str]) -> List[Union[dict, list]]:
    """
    Читает данные нескольких диалогов.
    
    Args:
        paths: Словарь {название: путь} к JSON-файлам
        
    Returns:
        Список данных диалогов
    """
    dialogs = []
    for name, path in paths.items():
        logger.debug(f"Обработка диалога '{name}' по пути {path}")
        dialog = get_dialog_data(path)
        if dialog is not None:
            dialogs.append(dialog)
        else:
            logger.warning(f"Не удалось загрузить диалог '{name}'")
            
    logger.info(f"Успешно загружено {len(dialogs)} из {len(paths)} диалогов")
    return dialogs