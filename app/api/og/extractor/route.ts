import { NextRequest, NextResponse } from 'next/server';
import orgs from 'open-graph-scraper';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.url) return NextResponse.json({ message: 'Bad Request' }, { status: 400 });

  const { error, result } = await orgs({ url: body.url });

  if (error) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  return NextResponse.json(result, { status: 200 });
}
