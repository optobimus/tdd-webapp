import { describe, expect, test } from 'vitest';
import { createApp } from '../../src/app.js';
import type { Todo } from '../../src/domain/todo.js';
import type { TodoRepository } from '../../src/repository/todo-repository.js';

class FakeTodoRepository implements TodoRepository {
  private readonly items: Todo[] = [];

  async listVisible(): Promise<Todo[]> {
    return [...this.items];
  }

  async create(title: string): Promise<Todo> {
    const item: Todo = {
      id: String(this.items.length + 1),
      title,
      completed: false,
      archived: false
    };

    this.items.push(item);
    return item;
  }
}

describe('todo API routes', () => {
  test('it returns service health status', async () => {
    const app = createApp(new FakeTodoRepository());
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    await app.close();
  });

  test('it lists todos from repository', async () => {
    const repository = new FakeTodoRepository();
    await repository.create('Buy milk');

    const app = createApp(repository);
    const response = await app.inject({ method: 'GET', url: '/api/todos' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      items: [{ id: '1', title: 'Buy milk', completed: false, archived: false }]
    });
    await app.close();
  });

  test('it creates a todo with a valid title', async () => {
    const app = createApp(new FakeTodoRepository());
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { title: 'Buy milk' }
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      item: { id: '1', title: 'Buy milk', completed: false, archived: false }
    });
    await app.close();
  });

  test('it rejects creating a todo with an empty title', async () => {
    const app = createApp(new FakeTodoRepository());
    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { title: '   ' }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Title must not be empty' });
    await app.close();
  });
});
