def get_value_from_token(token: str, current_dict: dict) -> str | None:
    # Разбиваем строку на части по символу '/'
    parts = token.split('/')
    
    # Если токен пустой или структура пустая, возвращаем пустую строку
    if not parts or not current_dict:
        return ""
    
    # Начинаем с первого элемента из parts
    part = parts[0]
    
    # Если это последний элемент, возвращаем _value
    if len(parts) == 1:
        return current_dict.get(part, {}).get('_value', None)
    else:
        # Если следующего элемента нет, возвращаем пустую строку
        if part not in current_dict:
            return None
        
        # Рекурсивно продолжаем искать в следующем уровне
        return get_value_from_token('/'.join(parts[1:]), current_dict.get(part, {}))

def update_topic_in_dict(topic: str, data: str, current_dict: dict = None) -> dict:
    parts = topic.split('/')

    if current_dict is None:
        current_dict = {}

    part = parts[0]

    # Если последний элемент
    if len(parts) == 1:
        if part in current_dict and "_value" in current_dict[part]:
            current_dict[part]["_value"] = data
        else:
            current_dict[part] = {"_value": data}
    else:
        # Если ключа нет — создаём
        if part not in current_dict or not isinstance(current_dict[part], dict):
            current_dict[part] = {"_value": None}

        # Рекурсивно обновляем вложенный словарь
        current_dict[part] = update_topic_in_dict('/'.join(parts[1:]), data, current_dict[part])

    return current_dict
