import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleAssistantRequest } from './functions/api/assistant';
import type { Plugin, PreviewServer, ViteDevServer } from 'vite';

const assistantApiMiddleware = (apiKey: string | undefined) =>
  (req: IncomingMessage, res: ServerResponse, next: (error?: Error) => void) => {
    if (req.url?.split('?')[0] !== '/api/assistant') {
      next();
      return;
    }

    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Use POST to send a message.' }));
      return;
    }

    const chunks: Buffer[] = [];
    let length = 0;
    let tooLarge = false;

    req.on('data', (chunk: Buffer | string) => {
      const data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      length += data.length;
      if (length > 64_000) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      if (!tooLarge) chunks.push(data);
    });

    req.on('end', () => {
      if (tooLarge) {
        res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'The assistant request is too large.' }));
        return;
      }

      const request = new Request('http://localhost/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: Buffer.concat(chunks).toString('utf8'),
      });

      void handleAssistantRequest(request, apiKey)
        .then(async (response) => {
          res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
          res.end(await response.text());
        })
        .catch((error: unknown) => {
          console.error('Local assistant API middleware failed.', error);
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'The local assistant service failed unexpectedly.' }));
          }
        });
    });
  };

const assistantApiPlugin = (apiKey: string | undefined): Plugin => {
  const attachMiddleware = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use(assistantApiMiddleware(apiKey));
  };

  return {
    name: 'canigo-assistant-api',
    configureServer: attachMiddleware,
    configurePreviewServer: attachMiddleware,
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'GEMINI_API_KEY');
  return {
    plugins: [react(), assistantApiPlugin(env.GEMINI_API_KEY)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: false,
    },
  };
});
