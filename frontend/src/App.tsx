import { type FormEvent, useEffect, useState } from 'react';
import type { TodoApiClient } from './api/todo-api-client';
import type { Todo } from './types';

type AppProps = {
  apiClient: TodoApiClient;
};

export function App({ apiClient }: AppProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        setTodos(await apiClient.getTodos());
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [apiClient]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) {
      return;
    }

    try {
      const created = await apiClient.createTodo(title);
      setTodos((current) => [...current, created]);
      setNewTitle('');
    } catch {
      setHasError(true);
    }
  }

  return (
    <main>
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-title">New to-do</label>
        <input
          id="new-title"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {isLoading ? <p>Loading...</p> : null}
      {!isLoading && !hasError && todos.length === 0 ? <p>No to-dos yet.</p> : null}
      {hasError ? <p>Failed to load to-dos.</p> : null}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </main>
  );
}
