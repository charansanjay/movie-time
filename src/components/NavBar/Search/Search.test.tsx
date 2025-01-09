import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';

import Search from './Search.tsx';

// Mock setQuery function
const setQuery = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe('Search Component', () => {
  it('should render the component without crashing', () => {
    render(<Search query='' setQuery={setQuery} />);
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
  });

    it('should call setQuery when the input value changes', async () => {
    render(<Search query='' setQuery={setQuery} />);
    const input = screen.getByPlaceholderText('Search movies...');
    fireEvent.change(input, { target: { value: 'test' } });
    await waitFor(() => {
      expect(setQuery).toHaveBeenCalledTimes(1);
    });
  });

  it('should call setQuery with the correct value when the input value changes', async () => {
    render(<Search query='' setQuery={setQuery} />);
    const input = screen.getByPlaceholderText('Search movies...');
    fireEvent.change(input, { target: { value: 'test' } });
    await waitFor(() => {
      expect(setQuery).toHaveBeenCalledWith('test');
      expect(setQuery).toHaveBeenCalledTimes(1);
    });
  });

  it('should focus the input element when the component mounts', () => {
    render(<Search query='' setQuery={setQuery} />);
    const input = screen.getByPlaceholderText('Search movies...');
    expect(input).toHaveFocus();
  });

  /* 
  * toMatchSnapshot is a Jest matcher that compares this output to a previously saved snapshot, 
    to ensure that the Search component renders consistently over time. 
  * If the current output matches the saved snapshot, the test will pass. 
    If it does not match, the test will fail, indicating that the rendered output of the Search component has changed.
  */
  it('should match the snapshot', () => {
    const { asFragment } = render(<Search query='' setQuery={setQuery} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match the snapshot with a query value', () => {
    const { asFragment } = render(<Search query='test' setQuery={setQuery} />);
    expect(asFragment()).toMatchSnapshot();
  });

});
