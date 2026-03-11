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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

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

  function startRename(id: string, title: string) {
    setEditingId(id);
    setRenameTitle(title);
  }

  async function handleRenameSubmit(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const title = renameTitle.trim();
    if (!title) {
      return;
    }

    try {
      const updated = await apiClient.renameTodo(id, title);
      setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)));
      setEditingId(null);
      setRenameTitle('');
    } catch {
      setHasError(true);
    }
  }

  async function handleCompletedChange(id: string, completed: boolean) {
    try {
      const updated = await apiClient.setTodoCompleted(id, completed);
      setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)));
    } catch {
      setHasError(true);
    }
  }

  async function handleArchiveCompleted() {
    try {
      await apiClient.archiveCompleted();
      setTodos((current) => current.filter((todo) => !todo.completed));
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
      <button type="button" onClick={handleArchiveCompleted}>
        Archive Completed
      </button>

      {isLoading ? <p>Loading...</p> : null}
      {!isLoading && !hasError && todos.length === 0 ? <p>No to-dos yet.</p> : null}
      {hasError ? <p>Failed to load to-dos.</p> : null}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <form onSubmit={(event) => handleRenameSubmit(event, todo.id)}>
                <input
                  type="checkbox"
                  aria-label={`Mark ${todo.title} completed`}
                  checked={todo.completed}
                  onChange={(event) => handleCompletedChange(todo.id, event.target.checked)}
                />
                <label htmlFor={`rename-${todo.id}`}>Rename to-do</label>
                <input
                  id={`rename-${todo.id}`}
                  value={renameTitle}
                  onChange={(event) => setRenameTitle(event.target.value)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <input
                  type="checkbox"
                  aria-label={`Mark ${todo.title} completed`}
                  checked={todo.completed}
                  onChange={(event) => handleCompletedChange(todo.id, event.target.checked)}
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.title}
                </span>
                <button type="button" onClick={() => startRename(todo.id, todo.title)}>
                  Rename
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
