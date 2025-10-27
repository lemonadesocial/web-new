import { useEffect, useRef } from 'react';

import { useModal } from "../components/core";

import { useAuth } from "./useAuth";
import { UnicornAuth } from '$lib/components/features/auth/UnicornAuthModal';
import { useAuthCookie } from "../utils/wagmi";

export const useConnectUnicornWallet = () => {
  const modal = useModal();
  const { reload } = useAuth();
  const authCookie = useAuthCookie();
  const modalId = useRef<number | undefined>(undefined);

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
            if (reloadAuth) {
              reload();
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
