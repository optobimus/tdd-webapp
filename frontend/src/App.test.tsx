import { render, screen, waitFor } from '@testing-library/react';
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

  async renameTodo(id: string, title: string): Promise<Todo> {
    const existing = this.todos.find((todo) => todo.id === id);
    if (!existing) {
      throw new Error('Todo not found');
    }

    existing.title = title;
    return existing;
  }

  async setTodoCompleted(id: string, completed: boolean): Promise<Todo> {
    const existing = this.todos.find((todo) => todo.id === id);
    if (!existing) {
      throw new Error('Todo not found');
    }

    existing.completed = completed;
    return existing;
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

  test('it renames an existing todo item', async () => {
    const user = userEvent.setup();
    render(
      <App
        apiClient={
          new FakeTodoApiClient([{ id: '1', title: 'Buy milk', completed: false, archived: false }])
        }
      />
    );

    await screen.findByText('Buy milk');
    await user.click(screen.getByRole('button', { name: 'Rename' }));
    await user.clear(screen.getByLabelText('Rename to-do'));
    await user.type(screen.getByLabelText('Rename to-do'), 'Buy oat milk');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Buy oat milk')).toBeDefined();
  });

  test('it marks an existing todo item completed', async () => {
    const user = userEvent.setup();
    render(
      <App
        apiClient={
          new FakeTodoApiClient([{ id: '1', title: 'Buy milk', completed: false, archived: false }])
        }
      />
    );

    const checkbox = await screen.findByRole('checkbox', { name: 'Mark Buy milk completed' });
    await user.click(checkbox);

    await waitFor(() => {
      expect((checkbox as HTMLInputElement).checked).toBe(true);
    });
    expect(await screen.findByText('Buy milk')).toBeDefined();
  });
});
