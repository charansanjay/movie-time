import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import "@testing-library/jest-dom";

import MoviesListBox from './MoviesListBox.tsx';

afterEach(() => {
  cleanup();
})

describe('MoviesListBox', () => {
  it("should render children by default", () => {
    render(
      <MoviesListBox>
        <p>Test Content</p>
      </MoviesListBox>
    );

    // Assert: Check if the children are displayed
    const content = screen.getByText('Test Content');
    expect(content).toBeInTheDocument();
  });

  it("should hide the children when button is clicked", () => {
    // Act: Render the component with some children.
    render(
      <MoviesListBox>
        <p>Test Content</p>
      </MoviesListBox>
    )

    // Assert: Initially, the children are visible
    expect(screen.getByText("Test Content")).toBeInTheDocument();


    // Get the toggle button and click it
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Assert: Children should not be visible after the button click
    const content = screen.queryByText('Test Content');
    expect(content).not.toBeInTheDocument();
  })

  it("should toggle the button text between '+' and '–'", () => {
    // Act: Render the component with some children.
    render(
      <MoviesListBox>
        <p>Test Content</p>
      </MoviesListBox>
    )

    // Get the toggle button
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("-");

    // Act: Click the button to toggle the state
    fireEvent.click(button)

    // Assert: The button should now display '+'
    expect(screen.getByRole('button')).toHaveTextContent("+");

    // Act: Click the button again to toggle the state back
    fireEvent.click(screen.getByRole('button'));

    // Assert: The button should now display '–' again
    expect(screen.getByRole('button')).toHaveTextContent("-");

  })
});