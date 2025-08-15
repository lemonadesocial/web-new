import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useModal } from "../components/core";

import { useAuth } from "./useAuth";
import { UnicornAuth } from '$lib/components/features/auth/UnicornAuthModal';

export const useConnectUnicornWallet = () => {
  const modal = useModal();
  const { reload } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
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
            
            const newParams = new URLSearchParams(params);
            newParams.delete('authCookie');
            const newUrl = window.location.pathname + (newParams.toString() ? `?${newParams.toString()}` : '');
            router.replace(newUrl);
          }
        }
      });
    }

    return () => {
      modal?.close(modalId.current);
    }
  }, [authCookie, modal]);
};
