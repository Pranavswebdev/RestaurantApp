import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test('splash screen displays and redirects to login', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/FoodRush/i).first()).toBeVisible();

    await page.waitForURL(/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('login page shows phone input and Get OTP button', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('input[type="tel"], input[type="text"]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /get otp/i })).toBeVisible();
  });

  test('protected route redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/home');

    await page.waitForURL(/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('protected restaurant route redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/restaurant/123');

    await page.waitForURL(/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
