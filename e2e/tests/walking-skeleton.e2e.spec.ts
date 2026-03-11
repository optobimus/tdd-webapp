import { expect, test } from '@playwright/test';

test('it shows the app shell and lets user add, rename, complete and archive one todo item', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'To-Do List' })).toBeVisible();
  await expect(page.getByText('No to-dos yet.')).toBeVisible();

  await page.getByLabel('New to-do').fill('Buy milk');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Buy milk')).toBeVisible();

  await page.getByRole('button', { name: 'Rename' }).click();
  await page.getByLabel('Rename to-do').fill('Buy oat milk');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Buy oat milk')).toBeVisible();

  const completedCheckbox = page.getByRole('checkbox', { name: 'Mark Buy oat milk completed' });
  await completedCheckbox.check();
  await expect(completedCheckbox).toBeChecked();

  await page.getByRole('button', { name: 'Archive Completed' }).click();
  await expect(page.getByText('No to-dos yet.')).toBeVisible();
});
