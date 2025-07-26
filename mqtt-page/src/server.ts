// server.ts
import next from 'next';
import { createServer } from 'http';
import { parse } from 'url';
import { startWebSocketServer } from './lib/ws-server';

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  startWebSocketServer(server);

  server.listen(port, () => {
    console.log(`🚀 Ready on http://localhost:${port}`);
  });
});
