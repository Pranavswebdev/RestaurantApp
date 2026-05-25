import { describe, it, expect, beforeEach } from 'vitest';
import useCartStore from '../cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], restaurantId: null });
  });

  it('starts with an empty cart', () => {
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.restaurantId).toBeNull();
  });

  it('adds an item to cart', () => {
    const item = { id: '1', name: 'Pizza', price: 299 };
    useCartStore.getState().addItem(item);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it('increases quantity when adding the same item', () => {
    const item = { id: '1', name: 'Pizza', price: 299 };
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(item);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('removes one quantity when removeItem is called', () => {
    const item = { id: '1', name: 'Pizza', price: 299 };
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(item);
    useCartStore.getState().removeItem('1');

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(1);
  });

  it('removes item from cart when quantity reaches 0', () => {
    const item = { id: '1', name: 'Pizza', price: 299 };
    useCartStore.getState().addItem(item);
    useCartStore.getState().removeItem('1');

    const state = useCartStore.getState();
    expect(state.items.length).toBe(0);
  });

  it('calculates cart total correctly', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Pizza', price: 299 });
    useCartStore.getState().addItem({ id: '2', name: 'Burger', price: 199 });
    useCartStore.getState().addItem({ id: '1', name: 'Pizza', price: 299 });

    const total = useCartStore.getState().getCartTotal();
    expect(total).toBe(299 * 2 + 199);
  });

  it('calculates item count correctly', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Pizza', price: 299 });
    useCartStore.getState().addItem({ id: '1', name: 'Pizza', price: 299 });
    useCartStore.getState().addItem({ id: '2', name: 'Burger', price: 199 });

    const count = useCartStore.getState().getCartItemCount();
    expect(count).toBe(3);
  });

  it('sets restaurant ID', () => {
    useCartStore.getState().setRestaurant('restaurant-123');
    expect(useCartStore.getState().restaurantId).toBe('restaurant-123');
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem({ id: '1', name: 'Pizza', price: 299 });
    useCartStore.getState().setRestaurant('restaurant-123');
    useCartStore.getState().clearCart();

    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.restaurantId).toBeNull();
  });
});
