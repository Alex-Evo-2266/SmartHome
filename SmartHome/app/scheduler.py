# app/scheduler.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.asyncio import AsyncIOExecutor
import logging

logger = logging.getLogger(__name__)

# Строка подключения к твоей MariaDB
# Если URL хранится в настройках, импортируй его
from app.bootstrap.settings import DB_URL
from app.bootstrap.const import TIMEZONE

jobstores = {
    'default': SQLAlchemyJobStore(url=DB_URL, tablename='apscheduler_jobs')
}

# Используй AsyncIOExecutor для выполнения async-функций
executors = {
    'default': AsyncIOExecutor() 
}

job_defaults = {
    'coalesce': False,       # Не объединять пропущенные запуски
    'max_instances': 1,      # Не допускать одновременного выполнения одной задачи
}

scheduler = AsyncIOScheduler(
    jobstores=jobstores,
    executors=executors,
    job_defaults=job_defaults,
    timezone=TIMEZONE
)