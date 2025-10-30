import os
import json
from pathlib import Path

from app.configuration.settings import DATA_FILE

def load_active_modules() -> dict:
	if not os.path.exists(DATA_FILE):
		return {}
	with open(DATA_FILE, "r") as f:
		try:
			return json.load(f)
		except json.JSONDecodeError:
			return {}

def save_active_modules(data: dict):
	Path(DATA_FILE).parent.mkdir(parents=True, exist_ok=True)
	with open(DATA_FILE, "w") as f:
		json.dump(data, f, indent=4)