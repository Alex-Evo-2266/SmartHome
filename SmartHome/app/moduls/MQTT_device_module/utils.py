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
    # Разбиваем строку на части по символу '/'
    parts = topic.split('/')
    
    # Если current_dict не передан, создаем пустой словарь
    if current_dict is None:
        current_dict = {}
    
    # Начинаем с первого элемента из parts
    part = parts[0]
    
    # Если это последний элемент, обновляем _value
    if len(parts) == 1:
        current_dict[part] = {"_value": data}
    else:
        # Если элемента нет в словаре, создаем его с _value
        if part not in current_dict:
            current_dict[part] = {"_value": None}
        
        # Рекурсивно продолжаем работать с оставшимися частями
        current_dict[part] = update_topic_in_dict('/'.join(parts[1:]), data, current_dict[part])
    
    # Возвращаем обновленный словарь
    return current_dict