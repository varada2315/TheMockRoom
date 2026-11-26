import type { Plugin, ViteDevServer } from 'vite';
import express from 'express';
import { apiRouter } from './routes';

export function viteApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-api-learning-portal',
    configureServer(server: ViteDevServer) {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use('/api', apiRouter);

      server.middlewares.use(app);
    },
    configurePreviewServer(server) {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use('/api', apiRouter);

      server.middlewares.use(app);
    },
  };
}
