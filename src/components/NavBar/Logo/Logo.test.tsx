import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

import Logo from './Logo.tsx';
import appLogo from '../../../images/cinema.svg';

afterEach(() => {
  cleanup();
})

describe('Logo Component', () => {
  it('should render without crashing', () => {

    // Act: Render the Logo component
    render(<Logo />);

    // Assert: Check if the component is rendered
    const logoElement = screen.getByRole('img', { name: 'action cut' })
    expect(logoElement).toBeInTheDocument();

  });

  it('should display the logo image with correct alt text', () => {
    // Act: Render the Logo
    render(<Logo />);

    // Assert: Check if the logo image is displayed with the correct alt text
    const logoImage = screen.getByAltText('action cut');
    expect(logoImage).toBeInTheDocument();
    
    /* You might encounter issues comparing the src attribute directly with appLogo if the src gets resolved to an absolute path. 
    Use a stringContaining matcher instead. */
    expect(logoImage).toHaveAttribute('src', expect.stringContaining(appLogo));
  });

  it('should display the correct heading text', () => {
    // Act: Render the Logo
    render(<Logo />);

    // Assert: Check if the heading text is displayed correctly
    const heading = screen.getByRole('heading', { name: /movie time/i });
    expect(heading).toBeInTheDocument();
  });
});