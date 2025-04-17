import { useAtomValue } from "jotai";

import { hydraClientIdAtom } from "$lib/jotai";
import { handleSignIn } from "$lib/utils/ory";

import { useOAuth2 } from "./useOAuth2";

export function useSignIn() {
	const { signIn } = useOAuth2();
	const hydraClientId = useAtomValue(hydraClientIdAtom);

	return () => {
		if (hydraClientId) {
			signIn();
		}

		handleSignIn();
	}
}
