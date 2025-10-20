import os
import logging
from typing import Dict, Optional, Any
from pathlib import Path
from app.configuration.settings import BASE_DIR
from .utils import json_read

from app.internal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

def get_pages_path(module_name: str) -> Dict[str, str]:
    """
    Получает пути к JSON-файлам страниц в указанном модуле.
    
    Args:
        module_name: Имя модуля в формате 'package.module'
        
    Returns:
        Словарь {название_страницы: путь_к_файлу}
        
    Examples:
        >>> get_pages_path('app.modules.admin')
        {'dashboard': '/path/to/app/modules/admin/pages/dashboard.json'}
    """
    try:
        # Используем Path для кроссплатформенности
        module_page_dir = Path(BASE_DIR).joinpath(*module_name.split('.')).joinpath('pages')
        logger.debug(f"Поиск страниц в директории: {module_page_dir}")
        
        if not module_page_dir.is_dir():
            logger.warning(f"Директория со страницами не найдена: {module_page_dir}")
            return {}
            
        pages_path = {}
        for item in module_page_dir.iterdir():
            if item.is_file() and item.suffix == '.json':
                logger.debug(f"Найден файл страницы: {item.name}")
                pages_path[item.stem] = str(item)
                
        logger.info(f"Найдено {len(pages_path)} страниц в модуле {module_name}")
        return pages_path
        
    except Exception as e:
        logger.error(f"Ошибка при поиске страниц: {str(e)}", exc_info=True)
        return {}

def get_page_data(path: str) -> Optional[Any]:
    """
    Читает данные страницы из JSON-файла.
    
    Args:
        path: Путь к JSON-файлу
        
    Returns:
        Данные страницы или None в случае ошибки
        
    Examples:
        >>> get_page_data('/path/to/page.json')
        {'title': 'Example Page', 'content': '...'}
    """
    try:
        if not os.path.exists(path):
            logger.error(f"Файл не существует: {path}")
            return None
            
        logger.debug(f"Чтение страницы из файла: {path}")
        page_data = json_read(path)
        
        if page_data is None:
            logger.error(f"Не удалось прочитать файл: {path}")
            return None
            
        logger.debug(f"Успешно прочитана страница из {path}")
        return page_data
        
    except Exception as e:
        logger.error(f"Ошибка чтения страницы из {path}: {str(e)}", exc_info=True)
        return None