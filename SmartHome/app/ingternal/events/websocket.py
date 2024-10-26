from fastapi import WebSocket, WebSocketDisconnect
from app.pkg.websoket.websocket import WebSocketMenager

async def websocket_endpoint(websocket: WebSocket):
	await WebSocketMenager.connect(websocket)
	try:
		while True:
			data = await websocket.receive_text()
	except WebSocketDisconnect:
		WebSocketMenager.disconnect(websocket)