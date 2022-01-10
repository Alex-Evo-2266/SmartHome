from pydantic import BaseModel, root_validator
from typing import Optional, List, Dict, Any
from enum import Enum

class TypeSRC(str, Enum):
    PATH = "path"
    TEXT = "text"
    URL = "url"

class TypeAction(str, Enum):
    REQUEST = "request"
    UPDATE = "update"
    LINC = "linc"

class Methods(str, Enum):
    POST = "post"
    GET = "get"

class fieldSRC(BaseModel):
    type: TypeSRC
    path: str
    url: Optional[str]

    @root_validator
    def srcValidator(cls, values):
        v_type = values.get("type")
        v_src = values.get("path")
        v_url = values.get("url")
        if v_type == "path" and v_src[0] != '.':
            raise ValueError('in path src must start with "."')
        if v_type == "url":
            if v_src[0] != '.':
                raise ValueError('in url src must start with "."')
            if v_url == None:
                raise ValueError('in url, the url field must be filled')
        return values

class CardFields(BaseModel):
    type = "base"
    title: fieldSRC
    value: fieldSRC

class TableFields(BaseModel):
    type = "base"
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
    lincInit: Optional[LincDeviceSchema]

    @root_validator
    def srcValidator(cls, values):
        v_type = values.get("type")
        v_address = values.get("address")
        v_method = values.get("method")
        v_body = values.get("body")
        v_lincInit = values.get("lincInit")
        if v_type == TypeAction.REQUEST and (not v_address or not v_method):
            raise ValueError('in castom mode, the address and method field must be filled')
        if v_type == TypeAction.REQUEST and v_method == Methods.POST and not v_body:
            raise ValueError('in post method, the body field must be filled')
        if v_type == TypeAction.LINC and not v_lincInit:
            raise ValueError('in linc, the lincInit field must be filled')
        return values

class MenuFieldSchema(BaseModel):
    title: fieldSRC
    action: List[ActionSchema]

class Cards(BaseModel):
    fields: List[CardFields]
    title: fieldSRC
    menu: Optional[List[MenuFieldSchema]]

class TibleCol(BaseModel):
    fields: List[TableFields]
    title: fieldSRC
    menu: Optional[List[MenuFieldSchema]]

class Content(BaseModel):
    src: str
    ws_src: Optional[str]
    typeContent = "table"
    rootField: str = "."

class CardContent(Content):
    typeContent = "card"
    items: Cards

class TableContent(Content):
    typeContent = "table"
    items: TibleCol

class Page(BaseModel):
    name: str
    menu: Optional[List[MenuFieldSchema]]
    content: Content

class Pages(BaseModel):
    name: str
    pages: List[Page]
