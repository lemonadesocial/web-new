import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import clsx from "clsx";

import { formInstancesAtom, submitHandlersAtom, useSetAtom } from "../store";
import { Button, LabeledInput, modal } from "$lib/components/core";
import { GetSelfVerificationStatusDocument } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { SELF_VERIFICATION_CONFIG } from "$lib/utils/constants";

import { GetVerifiedModal } from "../../modals/GetVerifiedModal";

export function SelfVerificationForm({ required }: { required: boolean }) {
  const setFormInstances = useSetAtom(formInstancesAtom);
  const setSubmitHandlers = useSetAtom(submitHandlersAtom);

  const form: UseFormReturn<{ isVerified: boolean }> = useForm<{ isVerified: boolean }>({
    defaultValues: {
      isVerified: false,
    },
    mode: 'onChange',
  });

  const { data } =useQuery(GetSelfVerificationStatusDocument, {
    variables: {
      config: SELF_VERIFICATION_CONFIG
    },
  });

  useEffect(() => {
    if (data?.getSelfVerificationStatus) {
      const allVerified = data.getSelfVerificationStatus.disclosures?.every((d: any) => d.verified);
      form.setValue('isVerified', allVerified);
    }
  }, [data]);

  const onSubmit = (data: { isVerified: boolean }) => {
    // Form validation handled by validation rules
    // This is just to satisfy form submission requirements
  };

  const handleVerifyClick = () => {
    modal.open(GetVerifiedModal, {
      dismissible: true,
    });
  };

  useEffect(() => {
    setFormInstances(prev => ({ ...prev, selfVerification: form }));
    setSubmitHandlers(prev => ({ ...prev, selfVerification: onSubmit }));
  }, []);

  useEffect(() => {
    form.register('isVerified', {
      validate: (value) => {
        console.log(required, value)
        if (required && !value) {
          return 'Self ID verification is required';
        }
        return true;
      }
    });
  }, [required]);

  const isVerified = form.watch('isVerified');

  console.log(form.formState.errors)

  return (
    <>
      <LabeledInput label="Self ID Verification" required={required}>
        {isVerified ? (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-sm bg-success-400/16 w-min">
            <i className="icon-verified text-success-400 size-5" />
            <p className="flex-1 text-success-400">Verified</p>
          </div>
        ) : (
          <Button
            variant="tertiary"
            className={clsx(
              'w-fit',
              form.formState.errors.isVerified && '!bg-danger-400/16 !hover:bg-danger-400/20 !text-danger-400',
            )}
            iconLeft="icon-self"
            onClick={handleVerifyClick}
          >
            Verify Self ID
          </Button>
        )}
      </LabeledInput>
    </>
  );
}