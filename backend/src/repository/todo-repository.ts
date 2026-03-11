import type { Todo } from '../domain/todo.js';

export type TodoRepository = {
  listVisible(): Promise<Todo[]>;
  create(title: string): Promise<Todo>;
  rename(id: string, title: string): Promise<Todo | null>;
  setCompleted(id: string, completed: boolean): Promise<Todo | null>;
  archiveCompleted(): Promise<number>;
};
