import { NextRequest } from "next/server";

import { HYDRA_PUBLIC_URL } from "$lib/utils/constants";
import { getSpaceHydraKeys } from "$lib/utils/space";

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const hostname = request.headers.get('x-forwarded-host');

	if (!hostname) {
		return new Response('Hostname is required', { status: 400 });
	}

	const space = await getSpaceHydraKeys(hostname);

	if (!space?.hydra_client_secret) {
		return new Response('Unauthorized', { status: 401 });
	}

	return await fetch(`${HYDRA_PUBLIC_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(`${space.hydra_client_id}:${space.hydra_client_secret}`),
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      subject_token: formData.get('session_token')?.toString() || '', // from Kratos session
      subject_token_type: "urn:ory:token-type:session",
      scope: "openid offline",
    }),
    credentials: "include",
	});
}
