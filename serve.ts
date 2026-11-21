// Tiny static server for playing the game locally: serves game/ at
// http://localhost:8080 with no build step.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'game');
const types: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const server = createServer(async (req, res) => {
  const path = normalize(join(root, decodeURIComponent(req.url?.split('?')[0] ?? '/') || '/'));
  if (!path.startsWith(root)) {
    res.writeHead(403);
    res.end();
    return;
  }
  const file = path.endsWith('/') ? join(path, 'index.html') : path;
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

server.listen(8080, () => console.log('Lantern Hollow at http://localhost:8080'));
