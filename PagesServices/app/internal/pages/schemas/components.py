from pydantic import BaseModel
from enum import Enum
from typing import Optional, Dict, List, Union

class ComponentType(str, Enum):
	CARD = "CARD",
	TABLE = "TABLE",
	TEXT = "TEXT",
	BUTTON = "BUTTON",
	COLUMNS = "COLUMNS",
	LIST = "LIST",
	KEY_VALUE = "KEY_VALUE",
	DIVIDER = "DIVIDER",
	FLEX_CONTAINER = "FLEX_CONTAINER",
	GRID_LAYOUT = "GRID_LAYOUT",
	PANEL = "PANEL",
	SLIDER = "SLIDER",
	SELECT = "SELECT",
	SWITCH = "SWITCH",
	SEND_TEXT = "SEND_TEXT",
	CONTENT_BOX = "CONTENT_BOX",
	JSON = "JSON"


class TypeSrc(str, Enum):
	MANUAL = 'MANUAL',
	SERVER_GENERATE = "SERVER_GENERATE"

class ActionType(str, Enum):
	GET_REQUEST = "GET_REQUEST",
	LINK = "LINK",
	DIALOG = "DIALOG",
	NONE = "NONE",
	MENU = "MENU",
	SYSTEM = "SYSTEM"

class ControlItemType(str, Enum):
	ENUM = "ENUM",
	SWITCH = "SWITCH",
	SEND_TEXT = "SEND_TEXT",
	TEXT = "TEXT",
	RANGE = "RANGE"


class IOption(BaseModel):
	borderRadius: Optional[int] = None
	color: Optional[str] = None
	backgroundColor: Optional[str] = None
	fontSize: Optional[int] = None
	width: Optional[int] = None
	height: Optional[int] = None
	pozition:str = "left"
	margin: Optional[str] = None
	padding: Optional[str] = None

class Action(BaseModel):
	class Config:  
		use_enum_values = True

	action_type: ActionType = ActionType.NONE
	action_target: Optional[str] = None
	close_dialog: Optional[bool] = None
	query: Optional[Dict[str,str]] = None
	arg: Optional[List[str | Dict[str,str]]] = None

class ComponentBase(BaseModel):
	class Config:  
		use_enum_values = True
		
	type: ComponentType
	name: str = ""
	option: Optional[IOption] = None

class Card(ComponentBase):
	type: ComponentType.CARD
	action: Action
	img: Optional[str] = None
	label: str
	value: Optional["Component"] = None

class Text(ComponentBase):
	type: ComponentType.TEXT
	value: str

class Button(ComponentBase):
	type: ComponentType.BUTTON
	action: Action
	label: str

class ColumnElement(BaseModel):
	indexCol: int
	value: "Component"

class Columns(ComponentBase):
	type: ComponentType.COLUMNS
	value: List[ColumnElement]
	count: int

class LayoutComponent(ComponentBase):
	src_key: Optional[str] = None
	src: Optional[TypeSrc] = None

class IList(LayoutComponent):
	type: ComponentType.LIST
	value: List['Component']

class IFlexContainer(LayoutComponent):
	type: ComponentType.FLEX_CONTAINER
	value: List['Component']

class IGridLayout(LayoutComponent):
	type: ComponentType.GRID_LAYOUT
	value: List['Component']

class IKeyValue(ComponentBase):
	type: ComponentType.KEY_VALUE
	label: str
	value: Optional['Component'] = None

class IDivider(ComponentBase):
	type: ComponentType.DIVIDER
	label: Optional[str] = None

class IPanel(ComponentBase):
	type: ComponentType.PANEL
	value: Optional['Component'] = None

class ISlider(ComponentBase):
	type: ComponentType.SLIDER
	action: Action
	value: int
	min: Optional[int] = None
	max: Optional[int] = None
	step: Optional[int] = None

class ISelectData(BaseModel):
	label: str
	data: str

class ISelect(ComponentBase):
	type: ComponentType.SELECT
	action: Action
	value: str
	items: List[str | ISelectData]

class ISwitch(ComponentBase):
	type: ComponentType.SWITCH
	action: Action
	value: bool

class ISendText(ComponentBase):
	type: ComponentType.SEND_TEXT
	action: Action
	value:Optional[str] = None

class IContentBox(ComponentBase):
    type: ComponentType.CONTENT_BOX
    label: str
    value: Optional['Component'] = None

class IJSON(ComponentBase):
    type: ComponentType.JSON
    value: str = ''

class Component(IContentBox, IJSON, Card, Text, Button, Columns, IList, IFlexContainer, IGridLayout, IKeyValue, IDivider, IPanel, ISlider, ISelect, ISwitch, ISendText):
	type: ComponentType
	action: Optional[Action] = None
	name: str = ""
	option: Optional[IOption] = None
	value: Optional[Union[str, int, bool, List['Component'], 'Component', List[ColumnElement]]] = None
	min: Optional[int] = None
	max: Optional[int] = None
	step: Optional[int] = None
	items: Optional[List[str | ISelectData]] = None
	label: Optional[str] = None
	src_key: Optional[str] = None
	src: Optional[TypeSrc] = None
	count: Optional[int] = None
	img: Optional[str] = None

# Component = Union[IContentBox, IJSON, Card, Text, Button, Columns, IList, IFlexContainer, IGridLayout, IKeyValue, IDivider, IPanel, ISlider, ISelect, ISwitch, ISendText]

# # Обновляем forward references
# Card.update_forward_refs()
# Text.update_forward_refs()
# Button.update_forward_refs()
# Columns.update_forward_refs()
# IList.update_forward_refs()
# IFlexContainer.update_forward_refs()
# IGridLayout.update_forward_refs()
# IKeyValue.update_forward_refs()
# IDivider.update_forward_refs()
# IPanel.update_forward_refs()
# ISlider.update_forward_refs()
# ISelect.update_forward_refs()
# ISwitch.update_forward_refs()
# ISendText.update_forward_refs()
# IContentBox.update_forward_refs()
# IJSON.update_forward_refs()

class Page(BaseModel):
	page: Component
	url: str
	name: str

class Dialog(BaseModel):
	components: Component
	title: str
	name: str
