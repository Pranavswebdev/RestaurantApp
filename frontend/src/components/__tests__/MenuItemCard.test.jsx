import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuItemCard from '../MenuItemCard';
import useCartStore from '../../stores/cartStore';

describe('MenuItemCard', () => {
  const mockItem = {
    id: 'item-1',
    name: 'Margherita',
    description: 'Classic cheese pizza',
    price: 299,
    isVeg: true,
    isAvailable: true,
  };

  beforeEach(() => {
    useCartStore.setState({ items: [], restaurantId: null });
  });

  it('renders item name', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('Margherita')).toBeInTheDocument();
  });

  it('renders item description', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('Classic cheese pizza')).toBeInTheDocument();
  });

  it('renders price with rupee symbol', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('₹299')).toBeInTheDocument();
  });

  it('shows + button to add item', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('shows quantity after adding item', () => {
    render(<MenuItemCard item={mockItem} />);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('increments quantity when + is clicked multiple times', () => {
    render(<MenuItemCard item={mockItem} />);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('decrements quantity when - is clicked', () => {
    render(<MenuItemCard item={mockItem} />);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('−'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows "Out of Stock" when item is unavailable', () => {
    const unavailableItem = { ...mockItem, isAvailable: false };
    render(<MenuItemCard item={unavailableItem} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
