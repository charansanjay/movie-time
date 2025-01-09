import { cleanup, render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
})

describe('ErrorMessage Component', () => {
  it("should render the error message correctly", () => {

    // Arrange: Provide the error message
    const errorMessage = "Something went wrong!";

    // Act: Render the ErrorMessage component with thge message prop
    render(<ErrorMessage message={errorMessage} />)

    // Assert: check if the message is displayed in the document(component)
    const errorElement = screen.getByText(`⛔ ${errorMessage}`);
    expect(errorElement).toBeInTheDocument();
  })

  it("applies the correct CSS class", () => {
    // Arrange: Provide the error message
    const errorMessage = "Antoher error occured";

    // Act: Render the ErrorMessage component with thge message prop
    render(<ErrorMessage message={errorMessage} />)

    // Assert: check if the message is displayed in the document(component)
    const errorElement = screen.getByText(`⛔ ${errorMessage}`);
    expect(errorElement).toHaveClass("error")
  })

});