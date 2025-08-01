import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { UnicornAuth } from "../components/features/auth/unicorn";
import { useModal } from "../components/core";

import { useAuth } from "./useAuth";

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

      console.log("opening UnicornAuth modal");
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
      modal?.close(modalId.current);
    }
  }, [authCookie, modal]);
};
