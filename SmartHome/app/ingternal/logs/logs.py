from datetime import datetime
from logging.handlers import TimedRotatingFileHandler

from app.configuration.settings import LOGS_DIR

import logging
import os

class CustomTimedRotatingFileHandler(TimedRotatingFileHandler):
    def __init__(self, filename, when='midnight', interval=1, backupCount=7, encoding=None, delay=False, utc=False):
        # Создаем базовый обработчик
        super().__init__(
            filename=filename,
            when=when,
            interval=interval,
            backupCount=backupCount,
            encoding=encoding,
            delay=delay,
            utc=utc
        )
        
        # Формат даты для имен файлов
        self.suffix = "%Y-%m-%d"
        self.extMatch = r"^\d{4}-\d{2}-\d{2}(\.\w+)?$"
        
    def getFilesToDelete(self):
        """
        Переопределяем метод для работы с нашим форматом имен файлов
        """
        dirName, baseName = os.path.split(self.baseFilename)
        fileNames = os.listdir(dirName)
        result = []
        
        prefix = baseName.replace('.log', '') + "."
        
        for fileName in fileNames:
            if fileName.startswith(prefix) and fileName.endswith('.log'):
                dateStr = fileName[len(prefix):-4]  # Извлекаем дату из имени файла
                if self.extMatch.match(dateStr):
                    result.append(os.path.join(dirName, fileName))
        
        if len(result) < self.backupCount:
            result = []
        else:
            result.sort()
            result = result[:len(result) - self.backupCount]
        return result

class LogManager:
    def __init__(self, filename:str, level = logging.DEBUG):
        self.name = filename
        self.level = level
        
    @staticmethod
    def get_current_log_filename(name:str):
        """Генерирует имя файла с текущей датой"""
        return f"{name}.{datetime.now().strftime('%Y-%m-%d')}.log"
    
    def get_file_handler(self):
        """Создает и настраивает обработчик логов"""
        log_file = os.path.join(LOGS_DIR, LogManager.get_current_log_filename(self.name))
        
        # Создаем директорию для логов если ее нет
        os.makedirs(LOGS_DIR, exist_ok=True)
        
        # Создаем обработчик с ротацией по времени (каждый день в полночь)
        handler = CustomTimedRotatingFileHandler(
            filename=os.path.join(LOGS_DIR, f'{self.name}.log'),  # Базовое имя
            when='midnight',
            interval=1,
            backupCount=7,  # Храним логи за 7 дней
            encoding='utf-8'
        )
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
        )
        handler.setFormatter(formatter)
        handler.setLevel(self.level)
        
        # Переименовываем текущий файл в формат с датой
        try:
            if os.path.exists(handler.baseFilename):
                os.rename(handler.baseFilename, log_file)
        except Exception as e:
            logging.error(f"Failed to rename log file: {str(e)}")
        
        return handler
    
class MyLogger:
    def __init__(self, handler: LogManager):
        self.handler = handler.get_file_handler()

    def get_logger(self, name: str):

        logger = logging.getLogger(name)
        logger.handlers.clear()
        logger.addHandler(self.handler)
        logger.setLevel(self.handler.level)
   
        
        return logger
