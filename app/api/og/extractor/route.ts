import { NextRequest, NextResponse } from 'next/server';
import orgs from 'open-graph-scraper';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) return NextResponse.json({ message: 'Bad Request' }, { status: 400 });

  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';
  const { error, result, html } = await orgs({ url, fetchOptions: { headers: { 'user-agent': userAgent } } });

  if (error) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  return NextResponse.json({ result, html }, { status: 200 });
}
