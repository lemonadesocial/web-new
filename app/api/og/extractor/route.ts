import { NextRequest, NextResponse } from 'next/server';
import orgs from 'open-graph-scraper';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) return NextResponse.json({ message: 'Bad Request' }, { status: 400 });

  const { error, result, html } = await orgs({ url });

  if (error) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  return NextResponse.json({ result, html }, { status: 200 });
}
