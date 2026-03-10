import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { runMigrations } from './db/migrations.js';
import { createPool } from './db/pool.js';
import { PostgresTodoRepository } from './repository/postgres-todo-repository.js';

const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://webapp:secret@localhost:5432/webapp';
const port = Number(process.env.PORT ?? 80);
const host = process.env.HOST ?? '0.0.0.0';

async function start(): Promise<void> {
  const pool = createPool(databaseUrl);
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const migrationsDirectory = path.resolve(currentDirectory, '../migrations');
  await runMigrations(pool, migrationsDirectory);

  const todoRepository = new PostgresTodoRepository(pool);
  const app = createApp(todoRepository);
  app.addHook('onClose', async () => {
    await pool.end();
  });

  await app.listen({ port, host });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
