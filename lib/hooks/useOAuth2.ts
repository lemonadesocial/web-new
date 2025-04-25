import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

import { hydraClientIdAtom, sessionAtom } from '$lib/jotai';
import { oidc } from '$lib/utils/oidc';

export function useOAuth2() {
	const router = useRouter();
	const [hydraClientId] = useAtom(hydraClientIdAtom);
	const setSession = useSetAtom(sessionAtom);

	const getUserManager = () => {
		if (oidc.userManager) return oidc.userManager;

		if (!hydraClientId) throw 'No site config for OAuth2';

		const userManager = oidc.setUserManager(hydraClientId);

		return userManager;
	};

	const signIn = async (email?: string) => {
		const userManager = getUserManager();

		await userManager.signinRedirect({
			scope: 'openid offline_access',
			state: encodeURI(window.location.href),
			...email && { extraQueryParams: { email } },
		});
	};

	const processSignIn = async () => {
		const userManager = getUserManager();

		const response = await userManager.signinRedirectCallback();

		const {
			access_token: token,
			state: returnTo,
			profile: {
				sid: _id,
				user,
			}
		} = response;

		setSession({
			_id: _id || '',
			user: user?.toString() || '',
			token,
			oidcUser: response.toStorageString(),
			returnTo: returnTo?.toString() || '',
		});
	};

	const signOut = async () => {
		const userManager = getUserManager();

		const user = await userManager.getUser();

		localStorage.clear();

		userManager.signoutRedirect({
			post_logout_redirect_uri: `${window.location.origin}/oauth2/logout`,
			id_token_hint: user?.id_token,
		});
	};

	const processSignOut = async () => {
		const userManager = getUserManager();

		await userManager.signoutRedirectCallback();

		router.push('/');
	};

	return { signIn, processSignIn, signOut, processSignOut };
}
