import { useEffect, useState } from 'react';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  archived: boolean;
};

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const payload = (await response.json()) as { items: Todo[] };
        setTodos(payload.items);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <main>
      <h1>To-Do List</h1>
      {isLoading ? <p>Loading...</p> : null}
      {!isLoading && !hasError && todos.length === 0 ? <p>No to-dos yet.</p> : null}
      {hasError ? <p>Failed to load to-dos.</p> : null}
    </main>
  );
}
