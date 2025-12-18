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
  const { provider } = await params;

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet parameter is required' }, { status: 400 });
  }

  if (!avatarImageUrl) {
    return NextResponse.json({ error: 'Avatar parameter is required' }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_AUTH_COOKIE_NAME environment variable is not set' },
      { status: 500 },
    );
  }

  const authCookie = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME)?.value;

  if (!authCookie) {
    return NextResponse.json({ error: 'Authentication cookie not found' }, { status: 401 });
  }

  const getPassportData = match(provider)
    .with(PassportProvider.VinylNation, () => getVinylNationData(authCookie))
    .with(PassportProvider.FestivalNation, () => getFestivalNationData(authCookie))
    .with(PassportProvider.DripNation, () => getDripNationData(authCookie))
    .otherwise(() => null);

  if (!getPassportData) {
    return NextResponse.json({ error: 'Passport data not found' }, { status: 404 });
  }

  const passportData = await getPassportData;

  if (!passportData) {
    return NextResponse.json({ error: 'Passport data not found' }, { status: 404 });
  }

  const getMintData = match(provider)
    .with(PassportProvider.VinylNation, () => getMintVinylNationPassportData)
    .with(PassportProvider.FestivalNation, () => getMintFestivalNationPassportData)
    .with(PassportProvider.DripNation, () => getMintDripNationPassportData)
    .otherwise(() => null);

  if (!getMintData) {
    return NextResponse.json({ error: 'Provider does not support' }, { status: 404 });
  }

  const mintData = await getMintData(
    passportData.userId,
    passportData.passportNumber,
    wallet,
    avatarImageUrl,
  );

  return NextResponse.json(mintData);
}
