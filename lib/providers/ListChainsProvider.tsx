import { useSetAtom } from "jotai";

import { useQuery } from "$lib/request";
import { ListChainsDocument } from "$lib/generated/backend/graphql";
import { listChainsAtom } from "$lib/jotai";

export function ListChainsProvider({ children }: { children: React.ReactNode }) {
  const setListChains = useSetAtom(listChainsAtom);
  const { loading } = useQuery(ListChainsDocument, {
    onComplete: (data) => {
      setListChains(data.listChains);
    },
  });

  if (loading) return null;

  return <>{children}</>;
}
