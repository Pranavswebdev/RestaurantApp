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

  it('shows ADD button when item not in cart', () => {
    render(<MenuItemCard item={mockItem} />);
    expect(screen.getByTestId('add-item-1')).toHaveTextContent('ADD');
  });

  it('shows quantity after adding item', () => {
    render(<MenuItemCard item={mockItem} />);
    fireEvent.click(screen.getByTestId('add-item-1'));
    expect(screen.getByTestId('qty-item-1')).toHaveTextContent('1');
  });

  it('increments quantity when + is clicked multiple times', () => {
    render(<MenuItemCard item={mockItem} />);
    fireEvent.click(screen.getByTestId('add-item-1')); // ADD -> qty 1
    fireEvent.click(screen.getByTestId('add-item-1')); // + -> qty 2
    fireEvent.click(screen.getByTestId('add-item-1')); // + -> qty 3
    expect(screen.getByTestId('qty-item-1')).toHaveTextContent('3');
  });

  it('decrements quantity when - is clicked', () => {
    render(<MenuItemCard item={mockItem} />);
    fireEvent.click(screen.getByTestId('add-item-1')); // qty 1
    fireEvent.click(screen.getByTestId('add-item-1')); // qty 2
    fireEvent.click(screen.getByTestId('remove-item-1')); // qty 1
    expect(screen.getByTestId('qty-item-1')).toHaveTextContent('1');
  });

  it('shows out of stock when item is unavailable', () => {
    render(<MenuItemCard item={{ ...mockItem, isAvailable: false }} />);
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });
});
