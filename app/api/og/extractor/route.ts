import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import orgs from 'open-graph-scraper';

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) return NextResponse.json({ message: 'Bad Request' }, { status: 400 });

    // SSRF protection: only allow http(s) schemes
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ message: 'Invalid URL' }, { status: 400 });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ message: 'Invalid URL scheme' }, { status: 400 });
    }

    // Block private/internal IP ranges
    const hostname = parsedUrl.hostname;
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.') ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('172.') && parseInt(hostname.split('.')[1]) >= 16 && parseInt(hostname.split('.')[1]) <= 31
    ) {
      return NextResponse.json({ message: 'URL not allowed' }, { status: 400 });
    }

    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';
    const { error, result, html } = await orgs({ url, fetchOptions: { headers: { 'user-agent': userAgent } } });

    if (error) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    return NextResponse.json({ result, html }, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
