import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RestaurantCard from '../RestaurantCard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('RestaurantCard', () => {
  const mockRestaurant = {
    _id: '123',
    name: 'Pizza Paradise',
    image: 'https://example.com/pizza.jpg',
    cuisines: ['Italian', 'Pizza'],
    rating: 4.5,
    deliveryTime: 25,
    deliveryCharge: 50,
    minOrder: 200,
    isOpen: true,
  };

  it('renders restaurant name', () => {
    renderWithRouter(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Pizza Paradise')).toBeInTheDocument();
  });

  it('renders restaurant cuisines', () => {
    renderWithRouter(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('renders rating and delivery time', () => {
    renderWithRouter(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
  });

  it('renders min order and delivery charge', () => {
    renderWithRouter(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText(/Min order: ₹200/)).toBeInTheDocument();
    expect(screen.getByText(/Delivery: ₹50/)).toBeInTheDocument();
  });

  it('shows "Closed" badge when restaurant is closed', () => {
    const closedRestaurant = { ...mockRestaurant, isOpen: false };
    renderWithRouter(<RestaurantCard restaurant={closedRestaurant} />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('does not show "Closed" badge when restaurant is open', () => {
    renderWithRouter(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.queryByText('Closed')).not.toBeInTheDocument();
  });

  it('navigates to restaurant detail page on click', () => {
    renderWithRouter(<RestaurantCard restaurant={mockRestaurant} />);
    fireEvent.click(screen.getByText('Pizza Paradise'));
    expect(mockNavigate).toHaveBeenCalledWith('/restaurant/123');
  });
});
