from app.pkg import QueueSender
import logging

logger = logging.getLogger(__name__)

sender_device = QueueSender(
    logger=logger,
    data_provider=None  # данные передаются напрямую при send()
)
