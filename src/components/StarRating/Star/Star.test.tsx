import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Star from './Star.tsx';

afterEach(() => {
  cleanup();
})

// Group the Star component tests
describe('Star Component', () => {
  const mockProps = {
    fullStar: false,
    color: '#fcc419',
    size: 48,
    onRate: vi.fn(), // Mock function for onRate
    onHoverIn: vi.fn(), // Mock function for onHoverIn
    onHoverOut: vi.fn(), // Mock function for onHoverOut
  };

  it('renders a star with the correct styles', () => {
    // Render the Star component
    render(<Star {...mockProps} />);

    // Assert the star element exists and has correct styles
    const starElement = screen.getByRole('button');
    expect(starElement).toBeInTheDocument();
    expect(starElement).toHaveStyle({
      width: `${mockProps.size}px`,
      height: `${mockProps.size}px`,
      cursor: 'pointer',
    });
  });

  it('renders a full star when fullStar is true', () => {
    // Render the Star component with fullStar set to true
    render(<Star {...mockProps} fullStar={true} />);

    // Check if the filled star SVG is rendered
    const filledStar = screen.getByRole('button').querySelector('svg[fill="#fcc419"]');
    expect(filledStar).toBeInTheDocument();
  });

  it('handles click, hover in, and hover out events', () => {
    // Render the Star component
    render(<Star {...mockProps} />);

    const starElement = screen.getByRole('button');

    // Simulate a click event
    fireEvent.click(starElement);
    expect(mockProps.onRate).toHaveBeenCalled();

    // Simulate a mouse enter event
    fireEvent.mouseEnter(starElement);
    expect(mockProps.onHoverIn).toHaveBeenCalled();

    // Simulate a mouse leave event
    fireEvent.mouseLeave(starElement);
    expect(mockProps.onHoverOut).toHaveBeenCalled();
  });
});
