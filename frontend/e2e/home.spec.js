import { test, expect } from '@playwright/test';

const mockRestaurants = [
  {
    _id: '1',
    name: 'Pizza Paradise',
    image: 'https://via.placeholder.com/300?text=Pizza+Paradise',
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
        ],
      },
    ],
  },
  {
    _id: '2',
    name: 'Burger Barn',
    image: 'https://via.placeholder.com/300?text=Burger+Barn',
    rating: 4.3,
    deliveryTime: 20,
    deliveryCharge: 40,
    minOrder: 150,
    cuisines: ['American', 'Burgers'],
    isOpen: true,
    categories: [],
  },
  {
    _id: '3',
    name: 'Healthy Bowl',
    image: 'https://via.placeholder.com/300?text=Healthy+Bowl',
    rating: 4.6,
    deliveryTime: 22,
    deliveryCharge: 40,
    minOrder: 200,
    cuisines: ['Healthy'],
    isOpen: false,
    categories: [],
  },
];

test.describe('Home Screen - Browse Restaurants', () => {
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
    });

    await page.route('**/api/v1/restaurants**', async (route) => {
      const url = new URL(route.request().url());
      const cuisine = url.searchParams.get('cuisine');
      const search = url.searchParams.get('search');

      let filtered = [...mockRestaurants];
      if (cuisine) {
        filtered = filtered.filter((r) => r.cuisines.includes(cuisine));
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(s) ||
            r.cuisines.some((c) => c.toLowerCase().includes(s))
        );
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filtered),
      });
    });
  });

  test('displays restaurant list on home page', async ({ page }) => {
    await page.goto('/home');

    await expect(page.getByText('Pizza Paradise')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Burger Barn')).toBeVisible();
    await expect(page.getByText('Healthy Bowl')).toBeVisible();
  });

  test('shows "Closed" badge for closed restaurants', async ({ page }) => {
    await page.goto('/home');

    await expect(page.getByText('Pizza Paradise')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Closed')).toBeVisible();
  });

  test('filters restaurants by cuisine when chip is clicked', async ({ page }) => {
    await page.goto('/home');

    await expect(page.getByText('Pizza Paradise')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Pizza' }).first().click();

    await expect(page.getByText('Pizza Paradise')).toBeVisible();
    await expect(page.getByText('Burger Barn')).not.toBeVisible();
  });

  test('searches restaurants by name', async ({ page }) => {
    await page.goto('/home');

    await expect(page.getByText('Pizza Paradise')).toBeVisible({ timeout: 10000 });

    const searchInput = page.getByPlaceholder(/search restaurant/i);
    await searchInput.fill('pizza');

    await expect(page.getByText('Pizza Paradise')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Burger Barn')).not.toBeVisible();
  });

  test('clears filter when "All" chip is clicked', async ({ page }) => {
    await page.goto('/home');

    await expect(page.getByText('Pizza Paradise')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Pizza' }).first().click();
    await expect(page.getByText('Burger Barn')).not.toBeVisible();

    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.getByText('Burger Barn')).toBeVisible({ timeout: 5000 });
  });

  test('shows logout button and logs out user', async ({ page }) => {
    await page.goto('/home');

    await expect(page.getByText('Pizza Paradise')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /logout/i }).click();

    await page.waitForURL(/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
