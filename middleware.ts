import { NextRequest, NextResponse } from 'next/server';

import { GetSpaceDocument } from '$lib/generated/backend/graphql';
import { getClient } from '$lib/request';

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  let hostname = req.headers.get(':authority') || req.headers.get('host');
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  const client = getClient();
  const { data } = await client.query({ query: GetSpaceDocument, variables: { hostname: hostname } });
  if (data.getSpace) {
    return NextResponse.rewrite(new URL(`/${hostname}/community${path === '/' ? '' : path}`, req.url));
  }

  // rewrite everything else to `/[domain]/path dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
