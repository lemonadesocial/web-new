const memoryCache: Record<string, { expiredAt: number, value: any }> = {};

export const getOrSet = async <T>(key: string, fn: () => Promise<T>, ttlMs: number) => {
  let cached = memoryCache[key];

  const now = Date.now();
  if (!cached || (cached.expiredAt < now)) {
    cached = {
      expiredAt: now + ttlMs,
      value: await fn(),
    };

    memoryCache[key] = cached;

    setTimeout(() => {
      delete memoryCache[key];
    }, ttlMs);
  }

  return cached.value as T;
};
