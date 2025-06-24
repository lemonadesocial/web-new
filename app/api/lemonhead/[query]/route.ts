import { NextRequest, NextResponse } from 'next/server';
import lemonhead from '$lib/lemon-heads';

export async function GET(req: NextRequest, { params }: any) {
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const where = searchParams.get('where');
  const query = (await params).query;

  if (query === 'body-type') {
    const { data } = await lemonhead.getBody({ limit, offset, where });
    return NextResponse.json(data);
  }

  if (query === 'accessories') {
    const { data, error } = await lemonhead.getAccessories({ limit, offset, where });
    if (error) {
      return NextResponse.json(error);
    }

    if (data) return NextResponse.json(data);
  }

  return NextResponse.json('OK');
}
