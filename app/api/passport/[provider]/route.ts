import { NextRequest, NextResponse } from 'next/server';
import { match } from 'ts-pattern';

import { getData as getVinylNationData } from '$lib/services/passports/vinyl-nation/admin';
import { getMintVinylNationPassportData } from '$lib/services/passports/vinyl-nation';

import { getData as getFestivalNationData } from '$lib/services/passports/festival-nation/admin';
import { getMintFestivalNationPassportData } from '$lib/services/passports/festival-nation';

import { getData as getDripNationData } from '$lib/services/passports/drip-nation/admin';
import { getMintDripNationPassportData } from '$lib/services/passports/drip-nation';

import { PassportProvider } from '$lib/graphql/generated/backend/graphql';

type Params = Promise<{ provider: PassportProvider }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const wallet = new URL(request.url).searchParams.get('wallet');
  const avatarImageUrl = new URL(request.url).searchParams.get('avatar');
  const username = new URL(request.url).searchParams.get('username');
  const { provider } = await params;

  if (!username) {
    return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
  }

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet parameter is required' }, { status: 400 });
  }

  if (!avatarImageUrl) {
    return NextResponse.json({ error: 'Avatar parameter is required' }, { status: 400 });
  }

  const getPassportData = match(provider)
    .with(PassportProvider.VinylNation, () => getVinylNationData())
    .with(PassportProvider.FestivalNation, () => getFestivalNationData())
    .with(PassportProvider.DripNation, () => getDripNationData())
    .otherwise(() => null);

  if (!getPassportData) {
    return NextResponse.json({ error: 'Provider does not support' }, { status: 400 });
  }

  const passportData = await getPassportData;

  if (!passportData) {
    return NextResponse.json({ error: 'Unable to get passport data' }, { status: 404 });
  }

  const getMintData = match(provider)
    .with(PassportProvider.VinylNation, () => getMintVinylNationPassportData)
    .with(PassportProvider.FestivalNation, () => getMintFestivalNationPassportData)
    .with(PassportProvider.DripNation, () => getMintDripNationPassportData)
    .otherwise(() => null);

  if (!getMintData) {
    return NextResponse.json({ error: 'Provider does not support' }, { status: 400 });
  }

  try {
    const mintData = await getMintData(
      username,
      passportData.passportNumber,
      wallet,
      avatarImageUrl,
    );

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
