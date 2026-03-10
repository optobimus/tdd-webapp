import { describe, expect, test } from 'vitest';
import { createApp } from '../../src/app.js';

describe('createApp', () => {
  test('it creates a fastify instance', () => {
    const app = createApp();

    expect(app).toBeDefined();
    void app.close();
  });
});
