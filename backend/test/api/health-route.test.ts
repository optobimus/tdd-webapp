import { describe, expect, test } from 'vitest';
import { createApp } from '../../src/app.js';

describe('health route', () => {
  test('it returns service health status', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    await app.close();
  });

  test('it returns an empty todo list from todos route', async () => {
    const app = createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/api/todos'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ items: [] });
    await app.close();
  });
});
