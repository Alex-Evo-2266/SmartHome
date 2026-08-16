from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field


# ============================================================
# DATA
# ============================================================


class DataBinding(BaseModel):
    binding: str


class DataExpression(BaseModel):
    expression: str


DataNode = (
    str
    | int
    | float
    | bool
    | DataBinding
    | DataExpression
)


# ============================================================
# ACTIONS
# ============================================================


class EmitAction(BaseModel):
    type: Literal["emit"] = "emit"

    event: str

    payload: Any | None = None


class SetDataAction(BaseModel):
    type: Literal["set_data"] = "set_data"

    path: str

    value: Any


class OpenModalAction(BaseModel):
    type: Literal["open_modal"] = "open_modal"

    modalId: str

    context: dict[str, Any] | None = None


class CloseModalAction(BaseModel):
    type: Literal["close_modal"] = "close_modal"


ActionSchema = Annotated[
    EmitAction
    | SetDataAction
    | OpenModalAction
    | CloseModalAction,
    Field(discriminator="type"),
]


# ============================================================
# WIDGET LAYOUT
# ============================================================


class WidgetLayout(BaseModel):
    x: int | None = None
    y: int | None = None
    w: int | None = None
    h: int | None = None


# ============================================================
# WIDGET
# ============================================================


class WidgetSchema(BaseModel):
    id: str

    type: str

    props: dict[str, Any] | None = None

    children: list[str] | None = None

    actions: list[ActionSchema] | None = None

    data: dict[str, DataNode] | None = None

    html: str | None = None

    css: str | None = None

    layout: WidgetLayout | None = None


Blocks = dict[str, WidgetSchema]


# ============================================================
# MODAL
# ============================================================


class OpenModalOptions(BaseModel):
    id: str

    schema: str

    header: str | None = None

    width: int | None = None

    height: int | None = None

    x: int | None = None

    y: int | None = None

    layout: str

    rootWidgets: list[str]


# ============================================================
# DASHBOARD SCHEMA
# ============================================================


class DashboardSchema(BaseModel):
    version: str

    blocks: Blocks

    rootWidgets: list[str]

    layout: str

    modals: list[OpenModalOptions] | None = None


# ============================================================
# DASHBOARD
# ============================================================


class DashboardIn(BaseModel):
    """
    Полное описание dashboard,
    которое приходит от frontend
    и сохраняется в YAML.
    """

    id: str

    title: str

    private: bool = False

    schema: DashboardSchema


class DashboardOut(BaseModel):
    """
    Полное описание dashboard,
    которое возвращается frontend.
    """

    id: str

    title: str

    private: bool

    schema: DashboardSchema


# ============================================================
# DASHBOARDS LIST
# ============================================================


class DashboardsData(BaseModel):
    dashboards: list[DashboardOut]



class ActiveDashboardOut(BaseModel):
    id: str
    title: str


class ActiveDashboardsData(BaseModel):
    dashboards: list[ActiveDashboardOut]