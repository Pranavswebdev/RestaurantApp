import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CuisineChip from '../CuisineChip';

describe('CuisineChip', () => {
  it('renders the label', () => {
    render(<CuisineChip label="Pizza" isSelected={false} onClick={() => {}} />);
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('applies selected styling when isSelected is true', () => {
    render(<CuisineChip label="Pizza" isSelected={true} onClick={() => {}} />);
    const button = screen.getByText('Pizza');
    expect(button.className).toContain('bg-ink');
    expect(button.className).toContain('text-cream');
  });

  it('applies unselected styling when isSelected is false', () => {
    render(<CuisineChip label="Pizza" isSelected={false} onClick={() => {}} />);
    const button = screen.getByText('Pizza');
    expect(button.className).toContain('bg-cream');
    expect(button.className).toContain('text-ink');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<CuisineChip label="Pizza" isSelected={false} onClick={onClick} />);
    fireEvent.click(screen.getByText('Pizza'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
