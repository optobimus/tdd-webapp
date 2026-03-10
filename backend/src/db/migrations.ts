import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Pool } from 'pg';

export async function runMigrations(pool: Pool, migrationsDirectory: string): Promise<void> {
  const files = (await readdir(migrationsDirectory)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = await readFile(path.join(migrationsDirectory, file), 'utf8');
    await pool.query(sql);
  }
}
