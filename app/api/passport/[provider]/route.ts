import { NextRequest, NextResponse } from 'next/server';
import { match } from 'ts-pattern';

import { getData } from '$lib/services/passports/common/admin';

import { getMintVinylNationPassportData } from '$lib/services/passports/vinyl-nation';
import { getMintFestivalNationPassportData } from '$lib/services/passports/festival-nation';
import { getMintDripNationPassportData } from '$lib/services/passports/drip-nation';

import { PassportProvider } from '$lib/graphql/generated/backend/graphql';
import { getMintLemonadePassportDataNew } from '$lib/services/passports/lemonade';

export async function GET(request: NextRequest) {
  const wallet = new URL(request.url).searchParams.get('wallet');
  const avatarImageUrl = new URL(request.url).searchParams.get('avatar');
  const fluffleTokenId = new URL(request.url).searchParams.get('fluffleTokenId');
  const username = new URL(request.url).searchParams.get('username');
  const provider = new URL(request.url).searchParams.get('provider');

  if (!username) {
    return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
  }

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet parameter is required' }, { status: 400 });
  }

  if (!avatarImageUrl) {
    return NextResponse.json({ error: 'Avatar parameter is required' }, { status: 400 });
  }

  if (!provider) {
    return NextResponse.json({ error: 'Provider parameter is required' }, { status: 400 });
  }

  const passportData = await getData({ provider: provider as PassportProvider, fluffleTokenId, wallet });

  if (!passportData) {
    return NextResponse.json({ error: 'Unable to get passport data' }, { status: 404 });
  }

  const getMintData = match(provider)
    .with(PassportProvider.Lemonade, () => getMintLemonadePassportDataNew)
    .with(PassportProvider.VinylNation, () => getMintVinylNationPassportData)
    .with(PassportProvider.FestivalNation, () => getMintFestivalNationPassportData)
    .with(PassportProvider.DripNation, () => getMintDripNationPassportData)
    .otherwise(() => null);

  if (!getMintData) {
    return NextResponse.json({ error: 'Provider does not support' }, { status: 400 });
  }

  try {
    const mintData = await getMintData({
      username,
      passportNumber: passportData.passportNumber,
      wallet,
      avatarImageUrl,
      fluffleTokenId,
    });

    return NextResponse.json(mintData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Failed to get mint data',
        message: errorMessage,
        ...(errorStack && { stack: errorStack }),
      },
      { status: 500 },
    );
  }
}
