from typing import List, Optional, Dict

def get_dict_from_list(list_dicts: List[Dict[str, str]], key: str, value: str):
	for dict_item in list_dicts:
		if dict_item and dict_item.get(key) == value:
			return dict_item
	return None