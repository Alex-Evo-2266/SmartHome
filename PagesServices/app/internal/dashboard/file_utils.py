import json
import os
from app.internal.dashboard.schemas.dashboard import Dashboard, DashboardCard, ControlElement, ControlElementType

def save_dashboard(dashboard: Dashboard, folder: str):
    os.makedirs(folder, exist_ok=True)
    file_path = os.path.join(folder, f"{dashboard.id}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(dashboard.model_dump(), f, ensure_ascii=False, indent=4)


def load_dashboard(name: str, folder: str) -> Dashboard:
    file_path = os.path.join(folder, f"{name}.json")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return Dashboard(**data)
