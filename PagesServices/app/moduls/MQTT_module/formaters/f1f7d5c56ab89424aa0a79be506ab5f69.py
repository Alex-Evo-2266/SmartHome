from app.internal.pages.schemas.components import ComponentType, Component, Action, ActionType, IOption
from app.internal.poll.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import SERVICE_DATA_POLL

MQTT_MESSAGES = "MQTT_messages"

def flatten_topic_dict(nested_dict: dict, parent_key: str = '', sep: str = '/') -> dict:
	flat_dict = {}
	
	for key, value in nested_dict.items():
		# Формируем новый ключ
		new_key = f"{parent_key}{sep}{key}" if parent_key else key
		
		if isinstance(value, dict) and "_value" in value:
			# Если это словарь с ключом "_value", добавляем его в результат
			flat_dict[new_key] = value["_value"]
			
			# Рекурсивно обходим оставшиеся ключи в этом словаре
			nested_flat_dict = flatten_topic_dict(value, new_key, sep)
			flat_dict.update(nested_flat_dict)
		elif isinstance(value, dict):
			# Если это обычный словарь, рекурсивно обходим его
			nested_flat_dict = flatten_topic_dict(value, new_key, sep)
			flat_dict.update(nested_flat_dict)
	
	return flat_dict

def formater()->list[Component]:

	services:ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
	service_data = services.get(MQTT_MESSAGES)
	if(not service_data):
		return []
	data = flatten_topic_dict(service_data)
	

	components = []
	for i in data:
		components.append(Component(
			type=ComponentType.CARD, 
			name=i,
			option=IOption(width=350),
			action=Action(
				action_type=ActionType.DIALOG,
				action_target="topic_data",
				data=Component(type=ComponentType.JSON, name=i, value=str(data[i]))
			),
			value=Component(
				type=ComponentType.TEXT, value=str(i)
		)))
	return components

