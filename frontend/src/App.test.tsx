import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { App } from './App';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('it shows the to-do list heading and empty-state message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    );

    render(<App />);

    expect(screen.getByRole('heading', { name: 'To-Do List' })).toBeDefined();
    expect(await screen.findByText('No to-dos yet.')).toBeDefined();
  });
});
