import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';

import { useMutation } from '$lib/graphql/request';
import { UpdateUserDocument, User } from '$lib/graphql/generated/backend/graphql';
import { userAtom } from '$lib/jotai';
import { UnicornAuth } from '$lib/components/features/auth/UnicornAuthModal';

import { useModal } from "../components/core";
import { useAuthCookie } from "../utils/wagmi";

import { useAuth } from "./useAuth";

export const useConnectUnicornWallet = () => {
  const modal = useModal();
  const { reload } = useAuth();
  const authCookie = useAuthCookie();
  const modalId = useRef<number | undefined>(undefined);
  const setUser = useSetAtom(userAtom);
  const [updateUser] = useMutation(UpdateUserDocument, {
    onComplete(_, data) {
      const user = data.updateUser as User;
      setUser(user);
    },
  });

  useEffect(() => {
    if (authCookie && modal) {
      if (modalId?.current !== undefined) {
        modal.close(modalId.current);
      }

      modalId.current = modal.open(UnicornAuth, {
        dismissible: false,
        props: {
          cookie: authCookie,
          onSuccess: (reloadAuth) => {
            try {
              sessionStorage.removeItem('unicorn_auth_cookie');
            } catch {}

            if (reloadAuth) {
              reload();
            }
            
            const url = new URL(window.location.href);
            const newName = url.searchParams.get('name');
            if (newName && newName.trim()) {
              updateUser({
                variables: { input: { display_name: newName.trim() } },
              }).finally(() => {
                url.searchParams.delete('name');
                window.history.replaceState({}, '', url.toString());
              });
            }
          }
        }
      });
    }

    return () => {
      modal?.close(modalId.current);
    }
  }, [authCookie, modal]);
};
