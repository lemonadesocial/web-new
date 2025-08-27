export const request = async <T>(uri: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<T> => {
  const response = await fetch(uri, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return (await response.json()) as T;
};
