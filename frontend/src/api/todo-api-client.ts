import type { Todo } from '../types';

export type TodoApiClient = {
  getTodos(): Promise<Todo[]>;
  createTodo(title: string): Promise<Todo>;
  renameTodo(id: string, title: string): Promise<Todo>;
  setTodoCompleted(id: string, completed: boolean): Promise<Todo>;
  archiveCompleted(): Promise<number>;
};

async function expectJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export class HttpTodoApiClient implements TodoApiClient {
  constructor(private readonly baseUrl: string = '/api') {}

  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${this.baseUrl}/todos`);
    const payload = await expectJsonResponse<{ items: Todo[] }>(response);
    return payload.items;
  }

  async createTodo(title: string): Promise<Todo> {
    const response = await fetch(`${this.baseUrl}/todos`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title })
    });

    const payload = await expectJsonResponse<{ item: Todo }>(response);
    return payload.item;
  }

  async renameTodo(id: string, title: string): Promise<Todo> {
    const response = await fetch(`${this.baseUrl}/todos/${id}/title`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title })
    });

    const payload = await expectJsonResponse<{ item: Todo }>(response);
    return payload.item;
  }

  async setTodoCompleted(id: string, completed: boolean): Promise<Todo> {
    const response = await fetch(`${this.baseUrl}/todos/${id}/completed`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ completed })
    });

    const payload = await expectJsonResponse<{ item: Todo }>(response);
    return payload.item;
  }

  async archiveCompleted(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/todos/archive-completed`, {
      method: 'POST'
    });

    const payload = await expectJsonResponse<{ archivedCount: number }>(response);
    return payload.archivedCount;
  }
}
