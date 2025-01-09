import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StarRating, { type StarRatingProps } from './StarRating.tsx';

afterEach(() => {
  cleanup();
})

describe('StarRating Component', () => {
  const mockOnSetRating = vi.fn();

  const defaultProps: StarRatingProps = {
    maxRating: 5,
    color: '#fcc419',
    size: 48,
    defaultRating: 0,
    messages: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    onSetRating: mockOnSetRating,
  };

  it('renders the correct number of stars', () => {
    // Render the StarRating component
    render(<StarRating {...defaultProps} />);

    // Assert the correct number of stars are rendered
    const stars = screen.getAllByRole('button');
    expect(stars.length).toBe(defaultProps.maxRating);
  });

  it('applies the correct default rating', () => {
    // Render the StarRating component with a default rating of 3
    render(<StarRating {...defaultProps} defaultRating={3} />);

    // Check if the correct number of stars are filled
    const filledStars = screen.getAllByRole('button').filter((star) =>
      star.querySelector('svg[fill="#fcc419"]'),
    );
    expect(filledStars.length).toBe(3);
  });

  it('updates the rating on click', () => {
    // Render the StarRating component
    render(<StarRating {...defaultProps} />);

    const stars = screen.getAllByRole('button');

    // Simulate clicking the fourth star
    fireEvent.click(stars[3]);
    expect(mockOnSetRating).toHaveBeenCalledWith(4);

    // Check if the correct number of stars are filled
    const filledStars = screen.getAllByRole('button').filter((star) =>
      star.querySelector('svg[fill="#fcc419"]'),
    );
    expect(filledStars.length).toBe(4);
  });

  it('updates the temp rating on hover', () => {
    // Render the StarRating component
    render(<StarRating {...defaultProps} />);

    const stars = screen.getAllByRole('button');

    // Simulate hovering over the second star
    fireEvent.mouseEnter(stars[1]);

    // Check if the correct number of stars are filled temporarily
    const filledStars = screen.getAllByRole('button').filter((star) =>
      star.querySelector('svg[fill="#fcc419"]'),
    );
    expect(filledStars.length).toBe(2);
  });

  it('displays the correct message based on rating', () => {
    // Render the StarRating component
    render(<StarRating {...defaultProps} />);

    const stars = screen.getAllByRole('button');

    // Simulate clicking the fifth star
    fireEvent.click(stars[4]);

    // Check if the correct message is displayed
    const message = screen.getByText('(5) Excellent');
    expect(message).toBeInTheDocument();
  });
});
