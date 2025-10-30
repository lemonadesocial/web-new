import { NextRequest, NextResponse } from 'next/server';
import assert from 'assert';

import { getMintZuGramaPassportData } from "../../../../lib/services/passports/zugrama";
import { getData } from "../../../../lib/services/passports/zugrama/admin";

export async function GET(request: NextRequest) {
  const wallet = new URL(request.url).searchParams.get('wallet');
  const avatarImageUrl =
    new URL(request.url).searchParams.get('avatar')
    || 'https://picsum.photos/200'; //-- remove this for production

  assert.ok(wallet);

  assert.ok(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME);
  const authCookie = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME)?.value;
  assert.ok(authCookie);

  const passportData = await getData(authCookie);

  assert.ok(passportData);

  if (!passportData?.selfVerifiedTimestamp) {
    return NextResponse.json({ error: 'Self not verified' }, { status: 400 });
  }

  const mintData = await getMintZuGramaPassportData(
    passportData.userId,
    passportData.passportNumber,
    passportData.selfVerifiedTimestamp,
    wallet,
    avatarImageUrl,
    false, //-- use true for production with ens
  );

  return NextResponse.json(mintData);
}
