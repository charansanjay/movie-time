import { useState, useEffect } from 'react'

interface UseLocalStorageStateProps<T> {
  initialState: T;
  key: string;
}

export const useLocalStorageState = <T,>({ initialState, key }: UseLocalStorageStateProps<T>): [T, React.Dispatch<React.SetStateAction<T>>] => {

  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem('watched');
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key])

  return [value, setValue];
}