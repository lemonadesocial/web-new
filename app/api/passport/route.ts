import { NextResponse } from 'next/server';

import { getMintLemonadePassportData } from '../../../lib/services/lemonade-passport';

export async function POST(request: Request) {
  const { wallet, ensForUserName, lensForUserName, fluffleTokenId } = await request.json() as { 
    wallet: string;
    ensForUserName: boolean;
    lensForUserName: boolean;
    fluffleTokenId: string;
  };

  const mintData = await getMintLemonadePassportData(
    wallet,
    ensForUserName,
    lensForUserName,
    fluffleTokenId,
  );

  return NextResponse.json(mintData);
}

