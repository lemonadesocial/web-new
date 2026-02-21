import { NextRequest, NextResponse } from 'next/server';

import { GetSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (static assets)
     * - favicon.ico
     * And exclude file extensions
     */
    '/((?!api/|proxy_static/|_next/|_static/|_vercel|assets|favicon\\.ico|[\\w-]+\\.\\w+).*)',
  ],
};

/** In-memory cache for space hostname lookups — avoids a GraphQL round-trip on every navigation */
const spaceCache = new Map<string, { isSpace: boolean; expiresAt: number }>();
const SPACE_CACHE_TTL = 60_000; // 60 seconds

async function checkIsSpace(hostname: string): Promise<boolean> {
  const cached = spaceCache.get(hostname);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.isSpace;
  }

  const client = getClient();
  const { data } = await client.query({ query: GetSpaceDocument, variables: { hostname } });
  const isSpace = !!data?.getSpace;

  // Evict expired entries when cache grows beyond 500 hostnames
  if (spaceCache.size > 500) {
    const now = Date.now();
    for (const [key, value] of spaceCache) {
      if (now >= value.expiresAt) spaceCache.delete(key);
    }
  }

  spaceCache.set(hostname, { isSpace, expiresAt: Date.now() + SPACE_CACHE_TTL });
  return isSpace;
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const hostname = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  if (
    [
      '/s/',
      '/e/',
      '/l/',
      '/lemonheads',
      '/create/event',
      '/timelines',
      '/profile',
      '/u/',
      '/passport',
      'lemonade-stand',
    ].some((subpath) => path.includes(subpath))
  ) {
    return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
  }

  if (hostname && (await checkIsSpace(hostname))) {
    return NextResponse.rewrite(new URL(`/${hostname}/community${path === '/' ? '' : path}`, req.url));
  }

  // rewrite everything else to `/[domain]/path dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path === '/' ? '/' : path}`, req.url));
}
