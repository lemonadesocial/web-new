import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../services/auth";
import {
  deleteRedEnvelopesByTokenIds,
  getRedEnvelopesByOwnerUser,
  RedEnvelopeInput,
  upsertRedEnvelopes,
} from "../../services/red-envelope";

const requireAuth = async (req: NextRequest) => {
  const user = await auth(req);

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}

const parseRequest = async<T>(req: NextRequest) => {
  const body = await req.json();

  return body as T;
}

export async function GET(request: NextRequest) {
  const ownerUser = await requireAuth(request);

  const data = await getRedEnvelopesByOwnerUser(ownerUser);
  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const ownerUser = await requireAuth(request);
  const body = await parseRequest<{envelopes: RedEnvelopeInput[]}>(request);

  const data = await upsertRedEnvelopes(ownerUser, body.envelopes);
  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const ownerUser = await requireAuth(request);

  const body = await parseRequest<{ tokenIds: number[] }>(request);

  await deleteRedEnvelopesByTokenIds(ownerUser, body.tokenIds);

  return NextResponse.json({}, { status: 200 });
}
