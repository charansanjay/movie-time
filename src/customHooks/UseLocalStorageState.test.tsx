import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, beforeEach } from 'vitest';

import { useLocalStorageState } from './useLocalStorageState.tsx';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorage.clear();
});

describe('useLocalStorageState', () => {
  it('should initialize with initial state if no value is in localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorageState({ initialState: 'test', key: 'testKey' })
    );

    expect(result.current[0]).toBe('test');
  });

  it('should initialize with value from localStorage if it exists', async () => {
    localStorage.setItem('testKey', JSON.stringify('storedValue'));
    const { result } = renderHook(() =>
      useLocalStorageState({ initialState: 'storedValue', key: 'testKey' })
    );

    await waitFor(() => expect(result.current[0]).toBe('storedValue')); // Correct behavior
  });

  it('should update localStorage when state changes', () => {
    const { result } = renderHook(() =>
      useLocalStorageState({ initialState: 'test', key: 'testKey' })
    );

    act(() => {
      result.current[1]('newValue');
    });

    expect(localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('should update state when setValue is called', () => {
    const { result } = renderHook(() =>
      useLocalStorageState({ initialState: 'test', key: 'testKey' })
    );

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
  });
});
