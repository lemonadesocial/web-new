import * as Sentry from '@sentry/nextjs';
import { NextRequest } from 'next/server';

function getUpstreamAiUrl() {
  const aiUrl = process.env.AI_API_HTTP || process.env.NEXT_PUBLIC_AI_API_HTTP;

  if (!aiUrl || aiUrl.startsWith('/')) {
    return null;
  }

  return aiUrl;
}

export async function POST(request: NextRequest) {
  const upstreamUrl = getUpstreamAiUrl();
  if (!upstreamUrl) {
    return Response.json({ error: 'AI API URL is not configured.' }, { status: 500 });
  }

  try {
    const body = await request.text();
    const headers = new Headers();

    const passThroughHeaders = ['authorization', 'content-type', 'accept', 'x-lens-profile-id', 'x-request-id'];
    passThroughHeaders.forEach((name) => {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    });

    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }

    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
    });

    const responseHeaders = new Headers();
    const contentType = upstreamResponse.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }

    const cacheControl = upstreamResponse.headers.get('cache-control');
    if (cacheControl) {
      responseHeaders.set('cache-control', cacheControl);
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: 'AI proxy request failed.' }, { status: 502 });
  }
}
