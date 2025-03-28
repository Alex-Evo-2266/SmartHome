from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from app.configuration.settings import LOGS_DIR
import logging
import os
import re

class CustomTimedRotatingFileHandler(TimedRotatingFileHandler):
    def __init__(self, filename, when='midnight', interval=1, backupCount=7, 
                 encoding=None, delay=False, utc=False, atTime=None):
        super().__init__(
            filename=filename,
            when=when,
            interval=interval,
            backupCount=backupCount,
            encoding=encoding,
            delay=delay,
            utc=utc,
            atTime=atTime
        )
        
        # Формат даты для ротируемых файлов
        self.suffix = "%Y-%m-%d"
        # Более строгое регулярное выражение
        self.extMatch = re.compile(r"^\d{4}-\d{2}-\d{2}$")
        
    def getFilesToDelete(self):
        """Определяет какие файлы нужно удалить при ротации"""
        dirName, baseName = os.path.split(self.baseFilename)
        if not os.path.exists(dirName):
            return []
            
        fileNames = os.listdir(dirName)
        result = []
        
        prefix = baseName + "."
        
        for fileName in fileNames:
            if fileName.startswith(prefix):
                suffix = fileName[len(prefix):]
                if self.extMatch.match(suffix):
                    result.append(os.path.join(dirName, fileName))
        
        if len(result) <= self.backupCount:
            return []
            
        result.sort()
        return result[:len(result) - self.backupCount]

class LogManager:
    def __init__(self, name: str, level=logging.DEBUG):
        self.name = name
        self.level = level
        
    def get_file_handler(self):
        """Создает и настраивает обработчик с ротацией по времени"""
        # Создаем директорию если ее нет
        os.makedirs(LOGS_DIR, exist_ok=True)
        
        # Создаем обработчик
        handler = CustomTimedRotatingFileHandler(
            filename=os.path.join(LOGS_DIR, f'{self.name}.log'),
            when='midnight',      # Ротация каждый день в полночь
            interval=1,           # Интервал - каждый день
            backupCount=7,        # Храним логи за 7 дней
            encoding='utf-8',     # Кодировка UTF-8
            delay=False           # Не откладывать создание файла
        )
        
        # Настраиваем формат логов
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
        )
        handler.setFormatter(formatter)
        handler.setLevel(self.level)
        
        return handler