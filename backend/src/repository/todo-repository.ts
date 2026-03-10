import type { Todo } from '../domain/todo.js';

export type TodoRepository = {
  listVisible(): Promise<Todo[]>;
  create(title: string): Promise<Todo>;
};
