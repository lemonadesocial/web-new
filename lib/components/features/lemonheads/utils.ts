import { Trait, TraitType } from "$lib/services/lemonhead/core";
import { LemonHeadValues } from "./types";

export const convertFormValuesToTraits = (formValues: LemonHeadValues) => {
  const traits = [] as Trait[];
  Object.keys(TraitType).forEach((k) => {
    let value = '';

    if (typeof formValues[k] === 'string') value = formValues[k];
    if (typeof formValues[k] === 'object') value = formValues[k].value;

    const filterOpts: any = [];
    if (formValues[k]?.filters) {
      Object.entries(formValues[k].filters).map(([key, value]) => filterOpts.push({ type: key, value }));
    }

    // @ts-expect-error check wrong types
    if (value) traits.push({ type: k, value: value, filters: filterOpts.length ? filterOpts : undefined });
  });

  return traits;
};

export const LEMONHEAD_CHAIN_ID = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? '1' : '11155111';
