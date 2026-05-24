import { describe, it, expect, vi, beforeEach } from 'vitest';
import { restaurantService } from '../restaurantService';

describe('restaurantService', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  describe('getRestaurants', () => {
    it('fetches restaurants without filters', async () => {
      const mockData = [{ _id: '1', name: 'Pizza Place' }];
      globalThis.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await restaurantService.getRestaurants();

      expect(globalThis.fetch).toHaveBeenCalled();
      const url = globalThis.fetch.mock.calls[0][0];
      expect(url).toContain('/restaurants?');
      expect(result).toEqual(mockData);
    });

    it('fetches restaurants with cuisine filter', async () => {
      globalThis.fetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await restaurantService.getRestaurants({ cuisine: 'Pizza' });

      const url = globalThis.fetch.mock.calls[0][0];
      expect(url).toContain('cuisine=Pizza');
    });

    it('fetches restaurants with search filter', async () => {
      globalThis.fetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await restaurantService.getRestaurants({ search: 'pizza' });

      const url = globalThis.fetch.mock.calls[0][0];
      expect(url).toContain('search=pizza');
    });

    it('throws error when fetch fails', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false });

      await expect(restaurantService.getRestaurants()).rejects.toThrow();
    });
  });

  describe('getRestaurantById', () => {
    it('fetches a specific restaurant', async () => {
      const mockData = { _id: '123', name: 'Pizza Place' };
      globalThis.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await restaurantService.getRestaurantById('123');

      const url = globalThis.fetch.mock.calls[0][0];
      expect(url).toContain('/restaurants/123');
      expect(result).toEqual(mockData);
    });

    it('throws error when restaurant not found', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false });

      await expect(restaurantService.getRestaurantById('999')).rejects.toThrow();
    });
  });
});
