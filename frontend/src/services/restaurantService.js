const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_BASE = `${API_ORIGIN}/api/v1`;

export const restaurantService = {
  getRestaurants: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.cuisine) {
      params.append('cuisine', filters.cuisine);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const response = await fetch(`${API_BASE}/restaurants?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch restaurants');
    return response.json();
  },

  getRestaurantById: async (id) => {
    const response = await fetch(`${API_BASE}/restaurants/${id}`);
    if (!response.ok) throw new Error('Failed to fetch restaurant');
    return response.json();
  },
};
