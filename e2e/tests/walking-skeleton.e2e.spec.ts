import { expect, test } from '@playwright/test';

test('it shows the app shell and empty todo list', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'To-Do List' })).toBeVisible();
  await expect(page.getByText('No to-dos yet.')).toBeVisible();
});
