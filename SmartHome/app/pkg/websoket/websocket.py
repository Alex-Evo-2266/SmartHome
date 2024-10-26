import json, logging

from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)

class WebSocketMenager:
	active_connections: List[WebSocket] = []
	
	@classmethod
	async def connect(cls, websocket: WebSocket):
		await websocket.accept()
		cls.active_connections.append(websocket)

	@classmethod
	def disconnect(cls, websocket: WebSocket):
		cls.active_connections.remove(websocket)

	@classmethod
	async def send_personal_message(cls, message: str, websocket: WebSocket):
		try:
			await websocket.send_text(message)
		except Exception as e:
			logger.warning("send_personal_message: client not found")
			cls.disconnect(websocket)

	@classmethod
	async def broadcast(cls, message: str):
		for connection in cls.active_connections:
			await connection.send_text(message)

	@classmethod
	async def send_information(cls, type: str, data):
		for connection in cls.active_connections:
			try:
				await connection.send_text(
					json.dumps({
						'type':type,
						'data':data
						})
				)
			except Exception as e:
				logger.warning("\x1b[33;20m" + "send_information: client not found")
				cls.disconnect(connection)
