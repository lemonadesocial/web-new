import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

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

  try {
    const client = getClient();

    const { data } = await client.query({ query: GetSpaceDocument, variables: { hostname: hostname } });
    if (data?.getSpace) {
      return NextResponse.rewrite(new URL(`/${hostname}/community${path === '/' ? '' : path}`, req.url));
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        source: 'middleware',
        'middleware.hostname': hostname || 'unknown',
      },
      extra: {
        url: req.url,
        hostname,
        path,
      },
    });
  }

  // rewrite everything else to `/[domain]/path dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path === '/' ? '/' : path}`, req.url));
}
