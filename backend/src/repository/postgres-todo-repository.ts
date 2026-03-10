import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import type { Todo } from '../domain/todo.js';
import type { TodoRepository } from './todo-repository.js';

type TodoRow = {
  id: string;
  title: string;
  completed: boolean;
  archived: boolean;
};

function toTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    archived: row.archived
  };
}

export class PostgresTodoRepository implements TodoRepository {
  constructor(private readonly pool: Pool) {}

  async listVisible(): Promise<Todo[]> {
    const result = await this.pool.query<TodoRow>(
      'SELECT id, title, completed, archived FROM todos WHERE archived = false ORDER BY id'
    );

    return result.rows.map(toTodo);
  }

  async create(title: string): Promise<Todo> {
    const id = randomUUID();
    const result = await this.pool.query<TodoRow>(
      'INSERT INTO todos (id, title, completed, archived) VALUES ($1, $2, false, false) RETURNING id, title, completed, archived',
      [id, title]
    );

    return toTodo(result.rows[0]);
  }
}
