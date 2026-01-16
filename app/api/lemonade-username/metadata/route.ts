import { NextResponse } from 'next/server';

import { getUserNameMetadata } from '$lib/services/lemonade-username';

export async function POST(request: Request) {
  const { username } = await request.json() as { username: string };

  return NextResponse.json({ metadata: getUserNameMetadata(username) });
}
