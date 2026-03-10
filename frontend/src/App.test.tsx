import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { App } from './App';

describe('App', () => {
  test('it shows the to-do list heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'To-Do List' })).toBeDefined();
  });
});
