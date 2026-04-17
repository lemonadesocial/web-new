import { unstable_cache } from 'next/cache';

export async function getSiteData(domain: string) {
  return await unstable_cache(
    async () => {
      const config = await import('./data');
      return config.DEFAULT_CONFIG;
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export function generateCssVariables(variables: Record<string, string | number>) {
  return Object.entries(variables)
    .map(([key, value]) => `${key}: ${String(value)};`)
    .join('\n');
}
