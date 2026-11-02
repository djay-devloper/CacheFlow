import { expect, test } from '@playwright/test';

test('creates, edits, filters, and deletes an expense', async ({ page }) => {
  const expenses = [];
  let nextId = 1;

  await page.addInitScript(() => {
    localStorage.setItem('token', 'e2e-token');
    localStorage.setItem('user', JSON.stringify({ fullName: 'E2E User' }));
  });

  await page.route('**/api/v1/auth/getUser', (route) => route.fulfill({
    json: { fullName: 'E2E User' },
  }));

  await page.route('**/api/v1/expense/get**', async (route) => {
    const url = new URL(route.request().url());
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const category = url.searchParams.get('category') || '';
    const matches = expenses.filter((expense) => {
      const text = `${expense.category} ${expense.note} ${expense.tags.join(' ')}`.toLowerCase();
      return (!search || text.includes(search)) && (!category || expense.category === category);
    });
    const pageNumber = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 10);
    await route.fulfill({
      json: {
        expenses: matches.slice((pageNumber - 1) * limit, pageNumber * limit),
        pagination: { page: pageNumber, limit, total: matches.length, pages: Math.ceil(matches.length / limit) },
        summary: { total: matches.reduce((total, expense) => total + expense.amount, 0) },
      },
    });
  });

  await page.route('**/api/v1/expense/add', async (route) => {
    const body = route.request().postDataJSON();
    const expense = { ...body, _id: String(nextId++), tags: body.tags || [] };
    expenses.push(expense);
    await route.fulfill({ status: 201, json: { expense } });
  });

  await page.route(/\/api\/v1\/expense\/[^/]+$/, async (route) => {
    const id = new URL(route.request().url()).pathname.split('/').at(-1);
    if (route.request().method() === 'PUT') {
      const index = expenses.findIndex((expense) => expense._id === id);
      expenses[index] = { ...expenses[index], ...route.request().postDataJSON() };
      await route.fulfill({ json: { expense: expenses[index] } });
      return;
    }
    if (route.request().method() === 'DELETE') {
      expenses.splice(expenses.findIndex((expense) => expense._id === id), 1);
      await route.fulfill({ json: { message: 'Expense deleted successfully' } });
      return;
    }
    await route.fallback();
  });

  await page.goto('/expense');
  await expect(page.getByRole('heading', { name: 'Expenses', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add expense', exact: true }).first().click();
  await page.getByRole('dialog').getByLabel('Category').fill('Coffee');
  await page.getByLabel('Amount').fill('180');
  await page.getByLabel('Note').fill('Morning coffee');
  await page.getByLabel(/Tags/).fill('work, food');
  await page.getByRole('dialog').getByRole('button', { name: 'Add expense' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Coffee' })).toContainText('Morning coffee');
  await expect(page.getByText('work', { exact: true })).toBeVisible();

  await page.getByLabel('Search').fill('Morning coffee');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Coffee' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Coffee' })).toBeVisible();

  const row = page.getByRole('row').filter({ hasText: 'Coffee' });
  await row.getByRole('button', { name: 'Edit expense' }).click();
  await page.getByLabel('Note').fill('Coffee with a teammate');
  await page.getByRole('dialog').getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Coffee' })).toContainText('Coffee with a teammate');

  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('row').filter({ hasText: 'Coffee' }).getByRole('button', { name: 'Delete expense' }).click();
  await expect(page.getByText('No expenses match these filters.')).toBeVisible();
});
