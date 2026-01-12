from app.core.runtime.room.send import restart_send_room_data
from app.core.runtime.device.send import restart_send_device_data
from app.bootstrap.settings import EXCHANGE_DEVICE_DATA, EXCHANGE_ROOM_DATA, EXCHANGE_SERVICE_DATA, DATA_SCRIPT, RABITMQ_HOST, RABITMQ_PORT
from app.bootstrap.const import SERVICE_DATA_POLL
from app.core.runtime.room.send_rabbitmq import sender_room
from app.core.runtime.module.sender_rabbitmq import sender_service
from app.core.runtime.device.send_rabbitmq import sender_device
from app.core.runtime.script.send_rabbitmq import sender_script
from app.core.state.get_store import get_container
from app.core.state.ObservableDict import ObservableDict, servicesDataPoll


async def start_ws_senders():
	await restart_send_room_data()
	await restart_send_device_data()


async def start_rabbitmq_senders():

	# подключение отправление rabitqm
	sender_device.connect(exchange_name=EXCHANGE_DEVICE_DATA, host=RABITMQ_HOST)
	sender_room.connect(exchange_name=EXCHANGE_ROOM_DATA, host=RABITMQ_HOST)
	sender_script.connect(queue_name=DATA_SCRIPT, host=RABITMQ_HOST)
	sender_service.connect(exchange_name=EXCHANGE_SERVICE_DATA, host=RABITMQ_HOST)

		# подписка на изменение
	get_container().device_store.subscribe_patch_global("sender", sender_device.send)
	get_container().room_store.subscribe_patch_global("sender", sender_room.send)

	service_data_poll: ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
	service_data_poll.subscribe_all("sender_service", sender_service.send)


def stop_rabbitmq_senders():
	sender_service.disconnect()
	sender_device.disconnect()
	sender_room.disconnect()
	sender_script.disconnect()