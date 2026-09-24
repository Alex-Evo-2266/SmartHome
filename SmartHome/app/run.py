
from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging
from app.configuration.server import Server
from app.scheduler import scheduler

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: запускаем scheduler
    scheduler.start()
    logger.info("APScheduler started")
    
    yield
    
    # Shutdown: gracefully останавливаем
    scheduler.shutdown()
    logger.info("APScheduler stopped")

def create_app(_=None) -> FastAPI:

    # logging.basicConfig(encoding='utf-8', level=logging.DEBUG)

    app = FastAPI(lifespan=lifespan)

    return Server(app).get_app()