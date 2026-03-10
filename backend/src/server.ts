import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 80);
const host = process.env.HOST ?? '0.0.0.0';

async function start(): Promise<void> {
  const app = createApp();
  await app.listen({ port, host });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
