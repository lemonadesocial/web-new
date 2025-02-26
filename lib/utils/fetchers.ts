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

export function generateCssVariables(variables: { [key: string]: string }) {
  return Object.entries(variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}
