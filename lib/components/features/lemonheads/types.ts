import { Trait } from '$lib/services/lemonhead/core';
import { LemonHeadsLayer } from '$lib/trpc/lemonheads/types';

export type LemonHeadValues = {
  body: Omit<Trait, 'filters'> & Partial<LemonHeadsLayer> & { filters: { [key: string]: string } };
  [key: string]:
    | (Omit<Trait, 'filters'> & Partial<LemonHeadsLayer> & { filters: { [key: string]: string } })
    | undefined;
};
