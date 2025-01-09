import { cleanup, render, screen } from '@testing-library/react';
import Loader from './Loader';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
})

describe('Loader component', () => {
  it('renders the loading text', () => {

    // Act: Render the Loader component
    render(<Loader />);

    // Assert: Check if the loading text is displayed in the document(component)
    const loaderElement = screen.getByText(/Loading.../i);
    expect(loaderElement).toBeInTheDocument();
  });

  it("applies the correct css class", () => {
    // Act: Render the Loader component
    render(<Loader />);

    // Assert: check if the element has the correct class
    const loaderElement = screen.getByText(/Loading.../i);
    expect(loaderElement).toHaveClass('loader');
  })
});