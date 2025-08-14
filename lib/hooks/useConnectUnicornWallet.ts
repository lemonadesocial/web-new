import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useModal } from "../components/core";

import { useAuth } from "./useAuth";
import { UnicornAuth } from '$lib/components/features/auth/UnicornAuthModal';

export const useConnectUnicornWallet = () => {
  const modal = useModal();
  const { reload } = useAuth();
  const params = useSearchParams();
  const authCookie = params.get('authCookie');
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
