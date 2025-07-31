import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { modal } from "../components/core";
import { UnicornAuth } from "../components/features/auth/unicorn";

import { useAuth } from "./useAuth";

export const useConnectUnicornWallet = () => {
  const { reload } = useAuth();
  const params = useSearchParams();
  const authCookie = params.get('authCookie');
  const modalId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (authCookie && modal.ready) {
      if (modalId?.current !== undefined) {
        modal.close(modalId.current);
      }

      modalId.current = modal.open(UnicornAuth, {
        dismissible: false,
        props: {
          cookie: authCookie,
          onSuccess: (reloadAuth, keepModalOpen) => {
            if (!keepModalOpen) {
              modal.close(modalId.current);
            }

            if (reloadAuth) {
              reload();
            }
          }
        }
      });
    }

    return () => {
      modal.close(modalId.current);
    }
  }, [authCookie, modal.ready]);
};
