import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { fileURLToPath } from 'node:url';
import { createPool } from '../../src/db/pool.js';
import { runMigrations } from '../../src/db/migrations.js';
import { PostgresTodoRepository } from '../../src/repository/postgres-todo-repository.js';

const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://webapp:secret@localhost:5432/webapp';
const shouldRun = process.env.RUN_DB_TESTS === '1';

describe.skipIf(!shouldRun)('PostgresTodoRepository', () => {
  const pool = createPool(databaseUrl);
  const repository = new PostgresTodoRepository(pool);

  beforeAll(async () => {
    await runMigrations(pool, fileURLToPath(new URL('../../migrations', import.meta.url)));
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM todos');
  });

  afterAll(async () => {
    await pool.end();
  });

  test('it creates and lists visible todos', async () => {
    await repository.create('Buy milk');

    const todos = await repository.listVisible();

    expect(todos).toHaveLength(1);
    expect(todos[0]).toMatchObject({
      title: 'Buy milk',
      completed: false,
      archived: false
    });
  });

  test('it excludes archived todos from visible list', async () => {
    const created = await repository.create('Buy milk');
    await pool.query('UPDATE todos SET archived = true WHERE id = $1', [created.id]);

    const todos = await repository.listVisible();

    expect(todos).toEqual([]);
  });

  test('it renames an existing todo', async () => {
    const created = await repository.create('Buy milk');

    const renamed = await repository.rename(created.id, 'Buy oat milk');

    expect(renamed).toMatchObject({
      id: created.id,
      title: 'Buy oat milk',
      completed: false,
      archived: false
    });
  });

  test('it marks an existing todo completed', async () => {
    const created = await repository.create('Buy milk');

    const updated = await repository.setCompleted(created.id, true);

    expect(updated).toMatchObject({
      id: created.id,
      title: 'Buy milk',
      completed: true,
      archived: false
    });
  });

  test('it archives all completed todos and removes them from visible list', async () => {
    const created = await repository.create('Buy milk');
    await repository.setCompleted(created.id, true);

    const archivedCount = await repository.archiveCompleted();
    const visibleTodos = await repository.listVisible();

    expect(archivedCount).toBe(1);
    expect(visibleTodos).toEqual([]);
  });
});
