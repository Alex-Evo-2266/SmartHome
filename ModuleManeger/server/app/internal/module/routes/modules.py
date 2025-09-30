import json, logging, yaml, os
from typing import Optional, List

from app.configuration.settings import ROUTE_PREFIX, MODULES_DIR

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

def load_module_configs(modules_dir: str):
    configs = []
    for root, dirs, files in os.walk(modules_dir):
        if "module_config.yml" in files:
            config_path = os.path.join(root, "module_config.yml")
            with open(config_path, "r", encoding="utf-8") as f:
                try:
                    config = yaml.safe_load(f)
                except yaml.YAMLError as e:
                    print(f"Ошибка чтения {config_path}: {e}")
                    continue
            configs.append({
                "module": os.path.basename(root),
                "path": root,
                "config": config
            })
    return configs

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/modules",
	tags=["modules"],
	responses={404: {"description": "Not found"}},
)
	
@router.get("/all")
async def get_role():
	try:

		return load_module_configs(MODULES_DIR)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
