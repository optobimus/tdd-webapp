import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import { App } from './App';
import type { TodoApiClient } from './api/todo-api-client';
import type { Todo } from './types';

class FakeTodoApiClient implements TodoApiClient {
  constructor(private todos: Todo[]) {}

  async getTodos(): Promise<Todo[]> {
    return [...this.todos];
  }

  async createTodo(title: string): Promise<Todo> {
    const created: Todo = {
      id: String(this.todos.length + 1),
      title,
      completed: false,
      archived: false
    };

    this.todos.push(created);
    return created;
  }
}

describe('App', () => {
  test('it shows the to-do list heading and empty-state message', async () => {
    render(<App apiClient={new FakeTodoApiClient([])} />);

    expect(screen.getByRole('heading', { name: 'To-Do List' })).toBeDefined();
    expect(await screen.findByText('No to-dos yet.')).toBeDefined();
  });

  test('it adds a new todo item from the form', async () => {
    const user = userEvent.setup();
    render(<App apiClient={new FakeTodoApiClient([])} />);

    await user.type(screen.getByLabelText('New to-do'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Buy milk')).toBeDefined();
  });
});
