// lib/ws-server.ts
import { WebSocketServer } from 'ws';
import { consumeExchange } from './rabbitmq';

let started = false;

export function startWebSocketServer(server: any) {
  if (started) return;

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🔌 Client connected');
  });

  consumeExchange('exchangeServiceData', 'fanout', (msg) => {
    console.log('➡️ Broadcasting message:', msg);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({type: "message_service", data: msg}));
      }
    });
  });

  started = true;
  console.log('✅ WebSocket server started');
}
