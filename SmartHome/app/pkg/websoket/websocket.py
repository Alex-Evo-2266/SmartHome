import json
import logging
from typing import List
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class WebSocketMenager:
    active_connections: List[WebSocket] = []

    @classmethod
    async def connect(cls, websocket: WebSocket):
        """Подключение клиента"""
        await websocket.accept()
        cls.active_connections.append(websocket)
        logger.info(f"Client {websocket.client} connected")

    @classmethod
    def disconnect(cls, websocket: WebSocket):
        """Отключение клиента с проверкой"""
        if websocket in cls.active_connections:
            cls.active_connections.remove(websocket)
            logger.info(f"Client {websocket.client} disconnected")
        else:
            logger.warning("Attempted to remove WebSocket that is not in active connections")

    @classmethod
    async def send_personal_message(cls, message: str, websocket: WebSocket):
        """Отправка личного сообщения клиенту"""
        try:
            await websocket.send_text(message)
        except Exception:
            logger.warning(f"send_personal_message: Client {websocket.client} not found")
            cls.disconnect(websocket)

    @classmethod
    async def broadcast(cls, message: str):
        """Отправка сообщения всем подключенным клиентам"""
        disconnected_clients = []
        for connection in cls.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                logger.warning(f"broadcast: Client {connection.client} not found")
                disconnected_clients.append(connection)

        # Удаляем всех клиентов, которые были отключены
        for client in disconnected_clients:
            cls.disconnect(client)

    @classmethod
    async def send_information(cls, type: str, data):
        """Отправка информации всем клиентам"""
        disconnected_clients = []
        for connection in cls.active_connections:
            await connection.send_text(json.dumps({'type': type, 'data': data}))
            # try:
            #     await connection.send_text(json.dumps({'type': type, 'data': data}))
            # except Exception:
            #     logger.warning(f"send_information: Client {connection.client} not found")
            #     disconnected_clients.append(connection)

        # Удаляем всех клиентов, которые были отключены
        for client in disconnected_clients:
            cls.disconnect(client)