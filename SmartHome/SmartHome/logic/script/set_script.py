from settings import SCRIPTS_DIR
from SmartHome.schemas.script import ScriptSchema, ScriptStatus
import yaml
import os, sys
import logging

logger = logging.getLogger(__name__)

class ScriptAlreadyExistsException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "script already exists"
	
	def __str__(self) -> str:
		if self.message:
			return f"ScriptAlreadyExistsException, {self.message}"
		else:
			return "ScriptAlreadyExistsException"

def add_script(script: ScriptSchema):
    try:
        script.status = ScriptStatus.MANUAL
        if(len(script.trigger.trigger)>0):
            script.status = ScriptStatus.AUTO
        data = script.dict()
        logger.debug(f'add script input data:{data} ')
        fileList = os.listdir(SCRIPTS_DIR)
        str = data["name"] + ".yml"
        for item in fileList:
            if(item==str):
                raise ScriptAlreadyExistsException()
        name = os.path.join(SCRIPTS_DIR, str)
        with open(name, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
        return "ok"
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        raise FileNotFoundError(e)

def delete_script(name:str):
    try:
        logger.debug(f'delete script. script:{name}')
        file_path = os.path.join(SCRIPTS_DIR,name)
        file_path = file_path + ".yml"
        os.remove(file_path)
        return "ok"
    except Exception as e:
        logger.error(f'error delete script. file:{name}. detail:{e}')
        raise