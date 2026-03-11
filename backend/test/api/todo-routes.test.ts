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

  async rename(id: string, title: string): Promise<Todo | null> {
    const existing = this.items.find((item) => item.id === id);
    if (!existing) {
      return null;
    }

    existing.title = title;
    return existing;
  }

  async setCompleted(id: string, completed: boolean): Promise<Todo | null> {
    const existing = this.items.find((item) => item.id === id);
    if (!existing) {
      return null;
    }

    existing.completed = completed;
    return existing;
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

  test('it renames a todo with a valid title', async () => {
    const repository = new FakeTodoRepository();
    await repository.create('Buy milk');

    const app = createApp(repository);
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/1/title',
      payload: { title: 'Buy oat milk' }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      item: { id: '1', title: 'Buy oat milk', completed: false, archived: false }
    });
    await app.close();
  });

  test('it rejects renaming when title is empty', async () => {
    const repository = new FakeTodoRepository();
    await repository.create('Buy milk');

    const app = createApp(repository);
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/1/title',
      payload: { title: '   ' }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Title must not be empty' });
    await app.close();
  });

  test('it returns not found when renaming a missing todo', async () => {
    const app = createApp(new FakeTodoRepository());
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/999/title',
      payload: { title: 'Buy oat milk' }
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Todo not found' });
    await app.close();
  });

  test('it marks a todo completed', async () => {
    const repository = new FakeTodoRepository();
    await repository.create('Buy milk');

    const app = createApp(repository);
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/1/completed',
      payload: { completed: true }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      item: { id: '1', title: 'Buy milk', completed: true, archived: false }
    });
    await app.close();
  });

  test('it rejects completed update when payload is invalid', async () => {
    const repository = new FakeTodoRepository();
    await repository.create('Buy milk');

    const app = createApp(repository);
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/1/completed',
      payload: { completed: 'yes' }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: 'Completed must be boolean' });
    await app.close();
  });

  test('it returns not found when updating completed for missing todo', async () => {
    const app = createApp(new FakeTodoRepository());
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/999/completed',
      payload: { completed: true }
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: 'Todo not found' });
    await app.close();
  });
});
