import Fastify, { type FastifyInstance } from 'fastify';
import type { TodoRepository } from './repository/todo-repository.js';

function parseTitle(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const title = value.trim();
  return title.length > 0 ? title : null;
}

export function createApp(todoRepository: TodoRepository): FastifyInstance {
  const app = Fastify();

  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/api/todos', async () => {
    const items = await todoRepository.listVisible();
    return { items };
  });

  app.post('/api/todos', async (request, reply) => {
    const body = request.body as { title?: unknown } | undefined;
    const title = parseTitle(body?.title);
    if (!title) {
      return reply.code(400).send({ error: 'Title must not be empty' });
    }

    const item = await todoRepository.create(title);
    return reply.code(201).send({ item });
  });

  return app;
}
