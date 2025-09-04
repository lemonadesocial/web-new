const request = async <T>(uri: string, method: 'POST' | 'GET', body?: Record<string, unknown>) => {
  if (!process.env.BACKEND_ADMIN_URL) return;

  const response = await fetch(`${process.env.BACKEND_ADMIN_URL}${uri}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...body && { body: JSON.stringify(body) },
  });

  return (response.body ? await response.json() : undefined) as T;
};

type Cache = {
  metadata_url?: string;
  image_url?: string;
}

export const getApproval = async (wallet: string, look: string, sponsor?: string) => {
  return request<{ signature: string; price: string }>(`/lemonhead/approval`, 'POST', { wallet, look, sponsor });
};

export const getCache = async (look: string) => {
  return request<Cache | undefined>(`/lemonhead/get_cache?look=${look}`, 'GET');
};

export const setCache = async (look: string, cache: Cache) => {
  return request<void>(`/lemonhead/set_cache?look=${look}`, 'POST', cache);
};
