from pydantic import BaseModel, root_validator
from typing import Optional, List, Dict, Any, Callable
from enum import Enum

class TypeSRC(str, Enum):
    PATH = "path"
    TEXT = "text"
    URL = "url"

class TypeField(str, Enum):
    TEXT = "text"
    JSON = "json"

class TypeAction(str, Enum):
    REQUEST = "request"
    UPDATE = "update"
    LINC = "linc"

class Methods(str, Enum):
    POST = "post"
    GET = "get"

class fieldSRC(BaseModel):
    type: TypeSRC
    path: Optional[str]
    value: Optional[str]
    url: Optional[str]

    @root_validator
    def srcValidator(cls, values):
        v_type = values.get("type")
        v_src = values.get("path")
        v_val = values.get("value")
        v_url = values.get("url")
        if (v_type == "path" or v_type == "url") and not v_src:
            raise ValueError('in path and url, the path field must be filled')
        if v_type == "text" and not v_val:
            raise ValueError('in text, the value field must be filled')
        if v_type == "path" and v_src[0] != '.':
            raise ValueError('in path src must start with "."')
        if v_type == "url":
            if v_src[0] != '.':
                raise ValueError('in url src must start with "."')
            if v_url == None:
                raise ValueError('in url, the url field must be filled')
        return values

class CardFields(BaseModel):
    type:TypeField = TypeField.TEXT
    title: fieldSRC
    value: fieldSRC

class TableFields(BaseModel):
    type:TypeField = TypeField.TEXT
    title: str
    value: fieldSRC

class ActionBodySchema(BaseModel):
    tytle: str
    field: fieldSRC

class LincDeviceSchema(BaseModel):
    address: Optional[fieldSRC]
    typeValue: Optional[fieldSRC]
    fields: Optional[fieldSRC]

class ActionSchema(BaseModel):
    type: TypeAction = TypeAction.REQUEST
    address: Optional[str]
    method: Optional[Methods] = Methods.GET
    body: Optional[ActionBodySchema]

    @root_validator
    def srcValidator(cls, values):
        v_type = values.get("type")
        v_address = values.get("address")
        v_method = values.get("method")
        v_body = values.get("body")
        v_lincInit = values.get("lincInit")
        if v_type == TypeAction.REQUEST and (not v_address or not v_method):
            raise ValueError('in request mode, the address and method field must be filled')
        if v_type == TypeAction.REQUEST and v_method == Methods.POST and not v_body:
            raise ValueError('in post method, the body field must be filled')
        return values

class MenuFieldSchema(BaseModel):
    title: fieldSRC
    action: List[ActionSchema]

class Cards(BaseModel):
    fields: List[CardFields]
    title: fieldSRC
    menu: Optional[List[MenuFieldSchema]]

class Table(BaseModel):
    fields: List[TableFields]
    title: fieldSRC
    menu: Optional[List[MenuFieldSchema]]

class Content(BaseModel):
    typeContent = "table"
    rootField: str = "."

class CardContent(Content):
    typeContent = "card"
    items: Cards

class TableContent(Content):
    typeContent = "table"
    items: Table

class Page(BaseModel):
    name: str
    menu: Optional[List[MenuFieldSchema]]
    src: str
    ws_src: Optional[str]
    content: Any

class Pages(BaseModel):
    linc: Optional[Callable] = None
    name: str
    pages: List[Page]

# linc device

class LincDevice(BaseModel):
    device: Dict

class TypeMessage(str, Enum):
    TEXT = "text"
    JSON = "json"

class TypeDeviceField(str, Enum):
    TEXT = "text"
    BINARY = "binary"
    NUMBER = "number"
    ENUM = "enum"

class DeviceConfig(BaseModel):
    name: str
    address: str
    low: str = ""
    high: str = ""
    icon: str = ""
    type:TypeDeviceField
    control:bool = False

class LincDeviceOut(BaseModel):
    typeConnect: str
    type: Optional[str] = None
    address: str
    valueType: TypeMessage = TypeMessage.TEXT
    config: List[DeviceConfig]
