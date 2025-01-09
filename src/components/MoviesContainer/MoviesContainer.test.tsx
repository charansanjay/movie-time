import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import "@testing-library/jest-dom";

import MoviesContainer from './MoviesContainer';

afterEach(() => {
  cleanup();
})

describe('MoviesContainer Component', () => {
  it('should render without crashing', () => {
    // Arrange: Render the MoviesContainer component
    render(<MoviesContainer>Test Content</MoviesContainer>);

    // Assert: Check if the content inside the container is rendered
    const containerElement = screen.getByText('Test Content');
    expect(containerElement).toBeInTheDocument();
  });

  it('should render children passed to it', () => {
    // Arrange: Render the component with multiple children
    render(
      <MoviesContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </MoviesContainer>
    );

    // Assert: Check if the children are rendered
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should apply the correct class to the main element', () => {
    // Arrange: Render the MoviesContainer component
    const { container } = render(
      <MoviesContainer>
        <div>Child</div>
      </MoviesContainer>
    );

    // Assert: Check if the main element has the correct class
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('main');
  });
});
