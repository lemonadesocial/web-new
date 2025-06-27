import { NextResponse } from 'next/server';

import { type Trait } from "../../../lib/services/lemonhead/core";
import { getMintNftData } from "../../../lib/services/lemonhead";

export async function POST(request: Request) {
  const { wallet, traits, sponsor } = await request.json() as { wallet: string, traits: Trait[], sponsor?: string };

  const mintData = await getMintNftData(traits, wallet, sponsor);

  return NextResponse.json(mintData);
}
