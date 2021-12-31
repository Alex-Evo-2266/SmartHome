import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from sqlalchemy import create_engine

from castom_moduls import init_moduls

from SmartHome.dbtest import metadata, database, engine
from SmartHome.models import User
from SmartHome.logic.call_functions import call_functions
from SmartHome.logic.weather import updateWeather
from SmartHome.logic.device.sendDevice import sendDevice
from SmartHome.websocket.manager import manager
from SmartHome.logic.server.modulesconfig import configManager

from SmartHome.logic.server.configInit import confinit

from SmartHome.api.auth import router as router_auth
from SmartHome.api.user import router as router_user
from SmartHome.api.style import router as router_style
from SmartHome.api.device import router as router_device
from SmartHome.api.server import router as router_server
from SmartHome.api.moduls import router_moduls


app = FastAPI();
# metadata.create_all(engine)
app.state.database = database

@app.on_event("startup")
async def startup() -> None:
    call_functions.subscribe("weather", updateWeather, 43200)
    base = configManager.getConfig("base")
    if isinstance(base['frequency'], int):
        call_functions.subscribe("devices", sendDevice, int(base['frequency']))
    else:
        call_functions.subscribe("devices", sendDevice, 6)
    confinit()
    init_moduls()
    database_ = app.state.database
    if not database_.is_connected:
        await database_.connect()
    loop = asyncio.get_running_loop()
    loop.create_task(call_functions.run())


@app.on_event("shutdown")
async def shutdown() -> None:
    database_ = app.state.database
    if database_.is_connected:
        await database_.disconnect()

@app.websocket("/ws/base")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

app.include_router(router_auth)
app.include_router(router_server)
app.include_router(router_device)
app.include_router(router_style)
app.include_router(router_user)
app.include_router(router_moduls)