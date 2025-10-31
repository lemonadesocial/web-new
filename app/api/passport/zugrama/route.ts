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
  // const authCookie = request.cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME)?.value;
  const authCookie = 'MTc2MTgzNTU1NHxncFhJQkQ5dGk0NEZsYURsNGhkT2l6NXdBNXdaRk55M2VHU2RJSkVtd3ZvTG9oNWEtNHljWnhSQWhiVDVCX21pOGtwN3B5T3ZHWE55WmZBX0FxaHZhbzhuUk1YelZkLTh2M20ycVJWR1NiS3RHV2J3ck52bWpRTUxacEhjV29EOTU1MG96eHFGVUhYNWFhWDJiTTVlNmxDLUVKSjJtUndfZnlmZW5Ya3FpV0NFLV9tTzlsV2dGMlJoQTAzODlVQkdaTFNTTzdEd1cwa1pIVk1ocVpRTV9IM2MzT2VGb0hYNEVCaHl5TDBQTnltWWRzNnR1N2NVYktoaFpfNTNlTUwyU3BkamFKWEV4U2c1NWgwNjl4UWR8SN0sggXtQ2fVvUnV_5wVWHWgaQf3_1THPJhTSI4aklg='
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
