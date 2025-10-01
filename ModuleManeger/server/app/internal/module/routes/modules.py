import json, logging, yaml, os
from typing import Optional, List, Dict

from app.configuration.settings import ROUTE_PREFIX, URL_REPO_MODULES_LIST, MODULES_DIR
from app.internal.module.search_modules import get_all_modules
from app.internal.module.install_module import clone_module
from app.internal.module.run_module import run_module_in_container, stop_module_in_container
from app.internal.module.schemas.modules import ModulesConf

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
	
@router.get("/all", response_model=Dict[str, ModulesConf])
async def get_role(no_cash: bool = False):
	try:
		files = get_all_modules(URL_REPO_MODULES_LIST, token=None, force_refresh=False, no_cash=no_cash)
		# return load_module_configs(MODULES_DIR)
		return files
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.get("/install")
async def get_role(name: str):
	try:
		res_folder = clone_module(name)
		# return load_module_configs(MODULES_DIR)
		return res_folder
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))


@router.get("/run")
async def get_role(name: str):
	try:
		# return load_module_configs(MODULES_DIR)
		return run_module_in_container(name)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.get("/stop")
async def get_role(name: str):
	try:
		# return load_module_configs(MODULES_DIR)
		return stop_module_in_container(name)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
