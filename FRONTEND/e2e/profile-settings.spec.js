import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test('updates profile contact details and profile photo', async ({ page }) => {
  let savedProfile;
  const updatedUser = {
    fullName: 'Alex Morgan',
    email: 'alex@example.com',
    phone: '',
    profileImageUrl: null,
  };

  await page.addInitScript((user) => {
    localStorage.setItem('token', 'e2e-token');
    localStorage.setItem('user', JSON.stringify(user));
  }, updatedUser);

  await page.route('**/api/v1/dashboard', (route) => route.fulfill({
    json: {
      totalBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
      lastTransactions: [],
      last30DaysExpense: { transactions: [] },
      last60DaysIncome: { transactions: [] },
    },
  }));
  await page.route('**/api/v1/auth/profile', async (route) => {
    savedProfile = route.request().postDataJSON();
    await route.fulfill({
      json: {
        message: 'Profile updated successfully',
        user: { ...updatedUser, ...savedProfile },
      },
    });
  });
  await page.route('**/api/v1/auth/upload-image', (route) => route.fulfill({
    json: {
      imageUrl: 'https://example.com/profile.png',
      user: {
        ...updatedUser,
        fullName: 'Alex Morgan-Smith',
        email: 'alex.smith@example.com',
        phone: '+1 555 123 4567',
        profileImageUrl: 'https://example.com/profile.png',
      },
    },
  }));

  await page.goto('/home');
  await page.getByRole('button', { name: 'Edit profile and account settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit your profile' });
  await dialog.getByLabel('Full name').fill('Alex Morgan-Smith');
  await dialog.getByLabel('Email address').fill('alex.smith@example.com');
  await dialog.getByLabel(/Phone number/).fill('+1 555 123 4567');
  await dialog.locator('input[type="file"]').setInputFiles({
    name: 'profile.png',
    mimeType: 'image/png',
    buffer: Buffer.from('fake image'),
  });
  await dialog.getByRole('button', { name: 'Save changes' }).click();

  await expect(dialog).toHaveCount(0);
  expect(savedProfile).toEqual({
    fullName: 'Alex Morgan-Smith',
    email: 'alex.smith@example.com',
    phone: '+1 555 123 4567',
  });
  await expect(page.getByRole('button', { name: 'Edit profile and account settings' })).toContainText('alex.smith@example.com');
  await expect(page.getByText('Alex Morgan-Smith', { exact: true }).first()).toBeVisible();
});
