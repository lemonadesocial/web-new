import { NextRequest } from "next/server";
import * as Sentry from '@sentry/nextjs';

import { HYDRA_PUBLIC_URL } from "$lib/utils/constants";
import { getSpaceHydraKeys } from "$lib/utils/space";

export async function POST(request: NextRequest) {
	try {
		const body = await request.formData();
		const hostname = request.headers.get('x-forwarded-host');

		if (!hostname) {
			return new Response('Hostname is required', { status: 400 });
		}

		const space = await getSpaceHydraKeys(hostname);

		if (!space?.hydra_client_secret) {
			return new Response('Unauthorized', { status: 401 });
		}

		const formData = new URLSearchParams(body as any);
		formData.append('client_secret', space.hydra_client_secret);

		return await fetch(`${HYDRA_PUBLIC_URL}/oauth2/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData
		});
	} catch (error) {
		Sentry.captureException(error);
		return new Response('Internal server error', { status: 500 });
	}
}
