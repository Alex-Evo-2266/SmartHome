def set_to_list_dict(items):
    item_list = list()
    for item in items:
        item_list.append(item.model_to_dict())
    return item_list
