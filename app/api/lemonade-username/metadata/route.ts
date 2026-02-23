import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

import { getUserNameMetadata } from '$lib/services/lemonade-username';

export async function POST(request: Request) {
  try {
    const { username } = await request.json() as { username: string };

    return NextResponse.json({ metadata: getUserNameMetadata(username) });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
