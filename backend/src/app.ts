import Fastify, { type FastifyInstance } from 'fastify';

export function createApp(): FastifyInstance {
  const app = Fastify();

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/api/todos', async () => ({ items: [] }));

  return app;
}
