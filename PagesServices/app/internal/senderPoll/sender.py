from app.pkg import QueueSender
import logging
from app.configuration.settings import RABITMQ_HOST, DATA_LISTEN_QUEUE

logger = logging.getLogger(__name__)

sender_service = QueueSender(
    logger=logger,
    data_provider=None  # данные передаются напрямую при send()
)

def init_sender():
    sender_service.connect(queue_name=DATA_LISTEN_QUEUE, host=RABITMQ_HOST)

