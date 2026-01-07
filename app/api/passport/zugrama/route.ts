import { NextRequest, NextResponse } from 'next/server';

import { getMintZuGramaPassportData } from '$lib/services/passports/zugrama';
import { getData } from '$lib/services/passports/zugrama/admin';

export async function GET(request: NextRequest) {
  const wallet = new URL(request.url).searchParams.get('wallet');
  const avatarImageUrl = new URL(request.url).searchParams.get('avatar');

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

  const passportData = await getData(authCookie);

  if (!passportData) {
    return NextResponse.json({ error: 'Passport data not found' }, { status: 404 });
  }

  if (!passportData.selfVerifiedTimestamp) {
    return NextResponse.json({ error: 'Self not verified' }, { status: 400 });
  }

  const mintData = await getMintZuGramaPassportData({
    userId: passportData.userId,
    passportNumber: passportData.passportNumber,
    selfVerifiedTimestamp: passportData.selfVerifiedTimestamp,
    wallet,
    avatarImageUrl,
  });

  return NextResponse.json(mintData);
}
