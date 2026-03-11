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

  app.patch('/api/todos/:id/title', async (request, reply) => {
    const params = request.params as { id?: string } | undefined;
    const id = params?.id?.trim();
    if (!id) {
      return reply.code(400).send({ error: 'Invalid id' });
    }

    const body = request.body as { title?: unknown } | undefined;
    const title = parseTitle(body?.title);
    if (!title) {
      return reply.code(400).send({ error: 'Title must not be empty' });
    }

    const item = await todoRepository.rename(id, title);
    if (!item) {
      return reply.code(404).send({ error: 'Todo not found' });
    }

    return { item };
  });

  app.patch('/api/todos/:id/completed', async (request, reply) => {
    const params = request.params as { id?: string } | undefined;
    const id = params?.id?.trim();
    if (!id) {
      return reply.code(400).send({ error: 'Invalid id' });
    }

    const body = request.body as { completed?: unknown } | undefined;
    if (typeof body?.completed !== 'boolean') {
      return reply.code(400).send({ error: 'Completed must be boolean' });
    }

    const item = await todoRepository.setCompleted(id, body.completed);
    if (!item) {
      return reply.code(404).send({ error: 'Todo not found' });
    }

    return { item };
  });

  return app;
}
