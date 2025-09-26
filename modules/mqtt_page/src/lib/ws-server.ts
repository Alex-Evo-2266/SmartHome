// lib/ws-server.ts
import { WebSocketServer } from 'ws';
import { consumeExchange } from './rabbitmq';
import { Server } from 'http';
import {EXCHANGE_SERVICE_DATA} from './envVar'

let started = false;

export function startWebSocketServer(server: Server) {
  if (started) return;

  const wss = new WebSocketServer({ server, path: "/ws/mqtt_page" });

  wss.on('connection', (ws) => {
    console.log('🔌 Client connected');
  });

  consumeExchange(EXCHANGE_SERVICE_DATA ?? 'exchangeServiceData', 'fanout', (msg) => {
    const message = JSON.stringify({type: "message_service", data: msg})
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  });

  started = true;
  console.log('✅ WebSocket server started');
}
