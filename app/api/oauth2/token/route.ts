import { HYDRA_PUBLIC_URL } from "$lib/utils/constants";
import { getSpaceHydraKeys } from "$lib/utils/space";

export async function POST(request: Request) {
	const body = await request.formData();
	const hostname = request.headers.get('host') || '';
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
}
