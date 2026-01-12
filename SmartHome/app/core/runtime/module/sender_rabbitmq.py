from app.pkg.deps.rabitmq import FanoutSender
from app.core.state.ObservableDict import servicesDataPoll, ObservableDict
from app.bootstrap.const import SERVICE_DATA_POLL
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

async def service_data_provider(data_poll:ObservableDict):
    service_pull:ObservableDict = data_poll.get(SERVICE_DATA_POLL)
    return service_pull.get_all()

sender_service = FanoutSender(
    logger=logger,
    data_provider=lambda: service_data_provider(servicesDataPoll)
)