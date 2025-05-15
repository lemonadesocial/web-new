import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

import { eventDataAtom, formInstancesAtom, useAtomValue, useSetAtom } from "../store";
import { ErrorText } from "$lib/components/core";

interface TermsFormInput {
  acceptTerms: boolean;
}

export function TermsForm() {
  const event = useAtomValue(eventDataAtom);

  const form: UseFormReturn<TermsFormInput> = useForm<TermsFormInput>({
    mode: 'onChange',
    defaultValues: {
      acceptTerms: false
    }
  });

  const setFormInstances = useSetAtom(formInstancesAtom);

  useEffect(() => {
    setFormInstances(prev => ({ ...prev, terms: form }));
  }, []);

  const { register, watch, formState: { errors } } = form;
  const acceptTerms = watch('acceptTerms');

  if (!event.terms_text) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptTerms"
            className="sr-only"
            {...register('acceptTerms', {
              required: "You must accept the terms to continue"
            })}
          />
          <div
            onClick={() => form.setValue('acceptTerms', !acceptTerms)}
            className="cursor-pointer"
          >
            {acceptTerms ? <i className="icon-checkbox-sharp size-5 text-white" /> : <i className="icon-checkbox-outline size-5 text-tertiary" />}
          </div>
        </div>
        <label htmlFor="acceptTerms" className="text-sm flex-1 cursor-pointer" dangerouslySetInnerHTML={{ __html: event.terms_text }} />
      </div>

      {errors.acceptTerms && <ErrorText message={errors.acceptTerms.message!} />}
    </div>
  );
}
