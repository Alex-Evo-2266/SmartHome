from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from SmartHome.settings import SERVER_CONFIG
from typing import Optional, List
import yaml, logging
from typing import Callable

logger = logging.getLogger(__name__)

def convert(data: List[ServerModuleConfigFieldSchema]):
    out = dict()
    for item in data:
        out[item.name] = item.value
    return out

class ModuleConfig(object):
    def __init__(self):
        self.callbacks = {}

    def readConfig(self):
        try:
            templates = None
            with open(SERVER_CONFIG) as f:
                templates = yaml.safe_load(f)
            if not templates:
                return dict()
            return templates
        except FileNotFoundError as e:
            logger.error(f"file not found. file:{SERVER_CONFIG}")
            raise

    async def restartall(self):
        for key in self.callbacks:
            f = self.callbacks[key]
            await f()

    def writeConfig(self, templates: dict):
        with open(SERVER_CONFIG, 'w') as f:
            yaml.dump(templates, f, default_flow_style=False)

    def addConfig(self, data: ServerModuleConfigSchema, callback: Callable = None):
        templates = self.readConfig()
        if(not templates):
            return
        if data.name in templates:
            conf = templates[data.name]
            for item in data.fields:
                if item.name in conf:
                    item.value = conf[item.name]
        templates[data.name] = convert(data.fields)
        self.writeConfig(templates)
        if callback:
            self.callbacks[data.name] = callback

    def removeConfig(self, name: str):
        self.callbacks.pop(name, None)
        templates = self.readConfig()
        templates.pop(name, None)
        self.writeConfig(templates)

    def getConfig(self, name: str):
        templates = self.readConfig()
        if name in templates:
            return templates[name]
        return None

    async def set(self, data: ServerModuleConfigSchema):
        templates = self.readConfig()
        templates[data.name] = convert(data.fields)
        self.writeConfig(templates)
        if data.name in self.callbacks:
            f = self.callbacks[data.name]
            await f()

    def allConfig(self)->List[ServerModuleConfigSchema]:
        out = []
        templates = self.readConfig()
        for key in templates:
            fields = []
            for key2 in templates[key]:
                fields.append(
                    ServerModuleConfigFieldSchema(
                        name=key2,
                        value=templates[key][key2]
                    )
                )
            out.append(
                ServerModuleConfigSchema(
                    name=key,
                    fields=fields
                )
            )
        return out

configManager = ModuleConfig()
