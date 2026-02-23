import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

import { type Trait } from "../../../lib/services/lemonhead/core";
import { getMintNftData } from "../../../lib/services/lemonhead";

export async function POST(request: Request) {
  try {
    const { wallet, traits, sponsor } = await request.json() as { wallet: string, traits: Trait[], sponsor?: string };

    const mintData = await getMintNftData(traits, wallet, sponsor);

    return NextResponse.json(mintData);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
