import json

from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

class WebSocketMenager:
	active_connections: List[WebSocket] = []
	
	@staticmethod
	async def connect(websocket: WebSocket):
		await websocket.accept()
		WebSocketMenager.active_connections.append(websocket)

	@staticmethod
	def disconnect(websocket: WebSocket):
		WebSocketMenager.active_connections.remove(websocket)

	@staticmethod
	async def send_personal_message(message: str, websocket: WebSocket):
		await websocket.send_text(message)

	@staticmethod
	async def broadcast(message: str):
		for connection in WebSocketMenager.active_connections:
			await connection.send_text(message)

	@staticmethod
	async def send_information(type: str, data):
		for connection in WebSocketMenager.active_connections:
			await connection.send_text(
				json.dumps({
					'type':type,
					'data':data
					})
			)
