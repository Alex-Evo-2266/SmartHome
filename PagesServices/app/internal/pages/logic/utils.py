import json
import logging
from typing import Any, Optional
from pathlib import Path

from app.internal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

def json_read(filename: str, encoding: str = 'utf-8') -> Optional[Any]:
    """
    Читает JSON-файл и возвращает его содержимое.
    
    Args:
        filename: Путь к JSON-файлу
        encoding: Кодировка файла (по умолчанию utf-8)
        
    Returns:
        Данные из JSON-файла или None в случае ошибки
        
    Raises:
        TypeError: Если filename не является строкой или Path
    """
    try:
        # Проверка типа входного параметра
        if not isinstance(filename, (str, Path)):
            raise TypeError(f"Ожидается str или Path, получено {type(filename)}")
        
        logger.debug(f"Чтение JSON-файла: {filename}")
        
        # Открытие и чтение файла
        with open(filename, 'r', encoding=encoding) as f_in:
            data = json.load(f_in)
            logger.debug(f"Успешно прочитан JSON-файл: {filename}")
            return data
            
    except FileNotFoundError:
        logger.error(f"Файл не найден: {filename}")
    except json.JSONDecodeError as e:
        logger.error(f"Ошибка декодирования JSON в файле {filename}: {str(e)}")
    except UnicodeDecodeError:
        logger.error(f"Ошибка кодировки в файле {filename}. Попробуйте другую кодировку.")
    except Exception as e:
        logger.error(f"Неожиданная ошибка при чтении {filename}: {str(e)}", exc_info=True)
    
    return None