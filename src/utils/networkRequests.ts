export type fetchDataResponse<T> = {
  data: T | null;
  error: Error | null;
};

export const fetchData = async <T>(
  url: string,
  options?: RequestInit
): Promise<fetchDataResponse<T>> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: T = await response.json();

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};