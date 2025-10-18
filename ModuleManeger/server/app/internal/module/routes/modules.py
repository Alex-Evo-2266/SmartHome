import json, logging, yaml, os
from typing import Optional, List, Dict

from app.configuration.settings import ROUTE_PREFIX, URL_REPO_MODULES_LIST, MODULES_DIR
from app.internal.module.search_modules import get_all_modules
from app.internal.module.install_module import clone_module, generate_docker_compose_from_module
from app.internal.module.run_module import run_module_in_container, stop_module_in_container
from app.internal.module.delete import remove_module
from app.internal.module.status import get_module_containers_status
from app.internal.module.schemas.modules import ModulesConfAndLoad, ModuleData, ModulesLoadData, AllModulesResData

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

TEST_TOCKEN = None

logger = logging.getLogger(__name__)

def load_module_configs(modules_dir: str)->List[ModuleData]:
	configs = []
	for root, dirs, files in os.walk(modules_dir):
		if "module-config.yml" in files:
			config_path = os.path.join(root, "module-config.yml")
			with open(config_path, "r", encoding="utf-8") as f:
				try:
					config = yaml.safe_load(f)
				except yaml.YAMLError as e:
					print(f"Ошибка чтения {config_path}: {e}")
					continue
			configs.append(ModuleData(
				module=config["name_module"],
				exemle=config["name"],
				path=root,
				config=config
			))
	return configs

def load_module_config_by_name(modules_dir: str, module_name: str) -> List[ModuleData]:
	"""
	Ищет и загружает конфиг конкретного модуля по названию папки.

	:param modules_dir: Путь к директории, где лежат все модули.
	:param module_name: Название нужного модуля (имя папки).
	:return: ModuleData или None, если модуль не найден или есть ошибка.
	"""
	found_modules: List[ModuleData] = []
	for folder in os.listdir(modules_dir):
		module_path = os.path.join(modules_dir, folder)
		config_path = os.path.join(module_path, "module-config.yml")

		if not os.path.isdir(module_path) or not os.path.exists(config_path):
			continue

		try:
			with open(config_path, "r", encoding="utf-8") as f:
				config = yaml.safe_load(f)
		except yaml.YAMLError as e:
			print(f"Ошибка чтения {config_path}: {e}")
			continue

		if config.get("name_module") == module_name:
			found_modules.append(
				ModuleData(
					exemle=config["name"],
					module=config["name_module"],
					path=module_path,
					config=config
				)
			)

	if not found_modules:
		print(f"Модули с именем '{module_name}' не найдены в {modules_dir}")

	return found_modules

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/modules",
	tags=["modules"],
	responses={404: {"description": "Not found"}},
)

# @router.get("/all", response_model=Dict[str, ModulesConfAndLoad])
# async def get_role(no_cash: bool = False):
# 	try:
# 		files = get_all_modules(URL_REPO_MODULES_LIST, token=TEST_TOCKEN, force_refresh=False, no_cash=no_cash)
# 		data = load_module_configs(MODULES_DIR)
# 		for key, item in files.items():
# 			filtred = [ModulesLoadData(name=item2.exemle , path=item2.path, status=get_module_containers_status(item2.exemle)) for item2 in data if item2.module == item.name_module]
# 			if(len(filtred) > 0):
# 				files[key].load = True
# 				files[key].load_module_name = filtred
# 		return files
# 	except Exception as e:
# 		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/all", response_model=AllModulesResData)
async def get_role(no_cash: bool = False):
	try:
		files = get_all_modules(URL_REPO_MODULES_LIST, token=TEST_TOCKEN, force_refresh=False, no_cash=no_cash)
		data = load_module_configs(MODULES_DIR)
		used = []
		locals = []
		for key, item in files.items():
			filtred = []
			for item2 in data:
				if item2.module == item.name_module:
					filtred.append(ModulesLoadData(name=item2.exemle , path=item2.path, status=get_module_containers_status(item2.exemle)))
					used.append(item2)
			if(len(filtred) > 0):
				files[key].load = True
				files[key].load_module_name = filtred
		for item in data:
			if item not in used:
				locals.append(ModulesConfAndLoad(**(item.config.dict()), local=True, load_module_name=[ModulesLoadData(name=item.exemle , path=item.path, status=get_module_containers_status(item.exemle))]))
		return AllModulesResData(data=[*list(files.values()), *locals])
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.get("/data/{name_module}", response_model=ModulesConfAndLoad)
async def get_role(name_module:str, no_cash: bool = False):
	try:
		files = get_all_modules(URL_REPO_MODULES_LIST, token=TEST_TOCKEN, force_refresh=False, no_cash=no_cash)
		find_module = next((item for item in files.values() if item.name_module == name_module), None)
		module_data_list = load_module_config_by_name(MODULES_DIR, name_module)
		config:ModulesConfAndLoad | None = None

		if len(module_data_list) > 0:
			config = ModulesConfAndLoad(**module_data_list[0].config.dict())
		elif find_module:
			config = find_module
		else:
			return JSONResponse(status_code=404, content=f"Модуль '{name_module}' не найден")

		config.load_module_name = [ModulesLoadData(name=item.exemle, path=item.path, status=get_module_containers_status(item.exemle)) for item in module_data_list]
		config.load = len(config.load_module_name) > 0

		return config
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/install")
async def get_role(name: str):
	try:
		res_folder = clone_module(name, TEST_TOCKEN)
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

@router.delete("/{name}")
async def get_role(name: str):
	try:
		# return load_module_configs(MODULES_DIR)
		return remove_module(name)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))


@router.get("/status")
async def get_role(name: str):
	try:
		# return load_module_configs(MODULES_DIR)
		return get_module_containers_status(name)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/generete")
async def get_role(name: str):
	try:
		module_path = os.path.join(MODULES_DIR, name)
		return generate_docker_compose_from_module(module_path)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))