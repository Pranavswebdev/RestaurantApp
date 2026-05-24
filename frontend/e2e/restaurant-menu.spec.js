import { test, expect } from '@playwright/test';

const mockRestaurant = {
  _id: '1',
  name: 'Pizza Paradise',
  image: 'https://via.placeholder.com/800x400?text=Pizza+Paradise',
  rating: 4.5,
  deliveryTime: 25,
  deliveryCharge: 50,
  minOrder: 200,
  cuisines: ['Italian', 'Pizza'],
  isOpen: true,
  categories: [
    {
      id: 'pizzas',
      name: 'Pizzas',
      items: [
        { id: 'p1', name: 'Margherita', description: 'Classic cheese pizza', price: 299, isVeg: true, isAvailable: true },
        { id: 'p2', name: 'Pepperoni', description: 'With pepperoni', price: 349, isVeg: false, isAvailable: true },
      ],
    },
    {
      id: 'sides',
      name: 'Sides',
      items: [
        { id: 's1', name: 'Garlic Bread', description: 'Crispy garlic bread', price: 129, isVeg: true, isAvailable: true },
        { id: 's2', name: 'Onion Rings', description: 'Crispy rings', price: 99, isVeg: true, isAvailable: false },
      ],
    },
  ],
};

test.describe('Restaurant Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            token: 'mock-token',
            user: { phone: '+919876543210', _id: 'user1' },
          },
          version: 0,
        })
      );
      window.localStorage.removeItem('cart-store');
    });

    await page.route('**/api/v1/restaurants/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockRestaurant),
      });
    });
  });

  test('displays restaurant details', async ({ page }) => {
    await page.goto('/restaurant/1');

    await expect(page.getByRole('heading', { name: 'Pizza Paradise' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('★ 4.5')).toBeVisible();
    await expect(page.getByText(/25 min/)).toBeVisible();
    await expect(page.getByText(/Min order: ₹200/)).toBeVisible();
  });

  test('displays menu categories and items', async ({ page }) => {
    await page.goto('/restaurant/1');

    await expect(page.getByRole('heading', { name: 'Pizza Paradise' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Margherita' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pepperoni' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Garlic Bread' })).toBeVisible();
  });

  test('shows "Out of Stock" for unavailable items', async ({ page }) => {
    await page.goto('/restaurant/1');

    await expect(page.getByText('Onion Rings')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Out of Stock')).toBeVisible();
  });

  test('adds item to cart and shows FloatingCartBar', async ({ page }) => {
    await page.goto('/restaurant/1');

    await expect(page.getByRole('heading', { name: 'Margherita' })).toBeVisible({ timeout: 10000 });

    await page.getByTestId('add-p1').click();

    await expect(page.getByText(/View Cart/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/1 item/i)).toBeVisible();
  });

  test('increments quantity when + clicked multiple times', async ({ page }) => {
    await page.goto('/restaurant/1');

    await expect(page.getByRole('heading', { name: 'Margherita' })).toBeVisible({ timeout: 10000 });

    await page.getByTestId('add-p1').click();
    await page.getByTestId('add-p1').click();
    await page.getByTestId('add-p1').click();

    await expect(page.getByTestId('qty-p1')).toHaveText('3');
    await expect(page.getByText(/3 items/i)).toBeVisible({ timeout: 5000 });
  });

  test('navigates back when back button clicked', async ({ page }) => {
    await page.goto('/home');
    await page.goto('/restaurant/1');

    await expect(page.getByRole('heading', { name: 'Pizza Paradise' })).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: '←' }).click();

    await page.waitForTimeout(500);
    expect(page.url()).not.toContain('/restaurant/1');
  });
});
