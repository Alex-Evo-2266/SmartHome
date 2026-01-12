from app.pkg.deps.rabitmq import QueueSender
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

sender_script = QueueSender(
    logger=logger,
    data_provider=None  # данные передаются напрямую при send()
)
