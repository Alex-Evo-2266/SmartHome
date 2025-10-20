// lib/ws-server.ts
import { WebSocketServer } from 'ws';
import { Server } from 'http';

let started = false;

export function startWebSocketServer(server: Server) {
  if (started) return;

  const wss = new WebSocketServer({ server, path: "/ws/__MODULE_NAME__" });

  wss.on('connection', (ws) => {
    console.log('🔌 Client connected');
  });

  started = true;
  console.log('✅ WebSocket server started');
}
