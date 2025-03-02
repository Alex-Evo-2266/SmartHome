from app.internal.pages.schemas.components import ComponentType, Component
from app.internal.poll.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import SERVICE_DATA_POLL

MQTT_MESSAGES = "MQTT_messages"

def formater()->list[Component]:


	services:ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
	print("p866",services._data)
	service_data = services.get(MQTT_MESSAGES)
	
	return [Component(type=ComponentType.TEXT, name="test_data", value=str(service_data))]
