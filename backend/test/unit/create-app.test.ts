import { describe, expect, test } from 'vitest';
import { createApp } from '../../src/app.js';
import type { TodoRepository } from '../../src/repository/todo-repository.js';

const fakeRepository: TodoRepository = {
  async listVisible() {
    return [];
  },
  async create(title) {
    return { id: '1', title, completed: false, archived: false };
  },
  async rename(id, title) {
    return { id, title, completed: false, archived: false };
  },
  async setCompleted(id, completed) {
    return { id, title: 'Buy milk', completed, archived: false };
  }
};

describe('createApp', () => {
  test('it creates a fastify instance', () => {
    const app = createApp(fakeRepository);

    expect(app).toBeDefined();
    void app.close();
  });
});
