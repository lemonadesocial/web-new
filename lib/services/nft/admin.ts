export const request = async <T>(uri: string, method: 'POST' | 'GET', body?: Record<string, unknown>) => {
  if (!process.env.BACKEND_ADMIN_URL) return;

  const response = await fetch(`${process.env.BACKEND_ADMIN_URL}${uri}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...body && { body: JSON.stringify(body) },
  });

  if (!response.ok) {
    const data = await response.bytes();
    throw new Error(Buffer.from(data).toString());
  }

  return (response.body ? await response.json() : undefined) as T;
};
